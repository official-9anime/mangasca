import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

class Asurascans {
    private parentUrl: string;
    private results: { status: number | string; results: any[] };

    constructor() {
        this.parentUrl = "https://asurascans.io";
        this.results = {
            status: "",
            results: [],
        };
    }

    // Helper to delay between requests
    private async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Fetch HTML using Axios with headers
    private async fetchHtml(url: string) {
        try {
            const response = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "Accept-Language": "en-US,en;q=0.9",
                },
            });
            this.results.status = response.status;
            return cheerio.load(response.data);
        } catch (error) {
            this.results.status = "Error fetching data";
            throw error;
        }
    }

    // Fetch HTML using Puppeteer (for advanced JS rendering)
    private async fetchHtmlWithPuppeteer(url: string) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        );

        try {
            await page.goto(url, { waitUntil: "networkidle2" });
            const content = await page.content();
            const $ = cheerio.load(content);
            await browser.close();
            return $;
        } catch (error) {
            await browser.close();
            this.results.status = "Error fetching data";
            throw error;
        }
    }

    // Search for content
    async search(query: string) {
        try {
            const url = `${this.parentUrl}/?s=${query}`;
            const $ = await this.fetchHtml(url);

            const cards = $("#content > div > div.postbody > div > div.listupd > div > div.bsx");
            const content: any[] = [];

            cards.each((_, element) => {
                const title = $(element).find("a").attr("title");
                const id = $(element).find("a").attr("href")?.split("/").slice(-2, -1)[0];
                const image = $(element).find("img.ts-post-image").attr("src");
                const chapters = $(element).find("div.epxs").text();

                content.push({ title, id, image, chapters });
            });

            this.results.results.push(content);
            return this.results;
        } catch (error) {
            this.results.results = [error.message];
            return this.results;
        }
    }

    // Get info about a specific item
    async info(id: string) {
        try {
            const url = `${this.parentUrl}/manga/${id}`;
            const $ = await this.fetchHtmlWithPuppeteer(url);

            const content: any = {
                images: $("div.seriestucon > div.seriestucontent > div.seriestucontl > div.thumb > img").attr("data-src"),
                description: $("div.seriestucon > div.seriestucontent > div.seriestucontentr > div.seriestuhead > div.entry-content.entry-content-single > p").text(),
                status: $("tr:nth-child(1) > td:nth-child(2)").text(),
                type: $("tr:nth-child(2) > td:nth-child(2)").text(),
                year: $("tr:nth-child(3) > td:nth-child(2)").text(),
                author: $("tr:nth-child(4) > td:nth-child(2)").text().split(","),
                artists: $("tr:nth-child(5) > td:nth-child(2)").text().split(","),
                serialization: $("tr:nth-child(6) > td:nth-child(2)").text().split(","),
                genres: $("div.seriestucon > div.seriestucontent > div.seriestucontentr > div.seriestucont > div > div > a")
                    .map((_, el) => $(el).text())
                    .get()
                    .join(", "),
                chapters: [],
            };

            const chapters = $("#chapterlist > ul > li > div > div");
            chapters.each((_, element) => {
                const title = $(element).find("span.chapternum").text();
                const date = $(element).find("span.chapterdate").text();
                const chapterId = $(element).find("a").attr("href")?.split("/").slice(-2, -1)[0];
                content.chapters.push({ title, date, id: chapterId });
            });

            this.results.results.push(content);
            return this.results;
        } catch (error) {
            this.results.results = [error.message];
            return this.results;
        }
    }

    // Fetch latest content
    async latest(page: string = "1") {
        try {
            const url = `${this.parentUrl}/manga/?page=${page}&order=update`;
            const $ = await this.fetchHtml(url);

            const cards = $("#content > div > div.postbody > div.bixbox.seriesearch > div.mrgn > div.listupd > div > div.bsx");
            const content: any[] = [];

            cards.each((_, element) => {
                const title = $(element).find("a").attr("title");
                const id = $(element).find("a").attr("href")?.split("/").slice(-2, -1)[0];
                const image = $(element).find("img.ts-post-image").attr("src");
                const chapters = $(element).find("div.epxs").text();

                content.push({ title, id, image, chapters });
            });

            this.results.results.push(content);
            return this.results;
        } catch (error) {
            this.results.results = [error.message];
            return this.results;
        }
    }
}

export default Asurascans;
