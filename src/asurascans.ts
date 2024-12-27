import axios from "axios";
import * as cheerio from "cheerio";

class Asurascans {
    private proxyUrl: string;
    private parentUrl: string;
    private results: { status: number | string; results: any[] };

    constructor() {
        this.proxyUrl = "https://sup-proxy.zephex0-f6c.workers.dev/api-text?url=";
        this.parentUrl = "https://asurascans.io";
        this.results = {
            status: "",
            results: [],
        };
    }

    private async fetchHtml(url: string) {
        try {
            const response = await axios.get(url);
            this.results.status = response.status;
            return cheerio.load(response.data);
        } catch (error) {
            this.results.status = "Error fetching data";
            throw error;
        }
    }

    async search(query: string) {
        try {
            const url = `${this.proxyUrl}${this.parentUrl}/?s=${query}`;
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

    async info(id: string) {
        try {
            const url = `${this.proxyUrl}${this.parentUrl}/manga/${id}`;
            const $ = await this.fetchHtml(url);

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

    async pages(id: string) {
        try {
            const url = `${this.proxyUrl}${this.parentUrl}/${id}`;
            const $ = await this.fetchHtml(url);

            const images = $("#readerarea > p > img").map((_, el) => $(el).attr("data-src")).get();
            this.results.results = images;
            return this.results;
        } catch (error) {
            this.results.results = [error.message];
            return this.results;
        }
    }

    async popular() {
        try {
            const url = `${this.proxyUrl}${this.parentUrl}`;
            const $ = await this.fetchHtml(url);

            const cards = $("#content > div > div.hotslid > div > div.listupd.popularslider > div > div > div.bsx");
            const content: any[] = [];

            cards.each((_, element) => {
                const title = $(element).find("a").attr("title");
                const id = $(element).find("a").attr("href")?.split("/").slice(-2, -1)[0];
                const image = $(element).find("img.ts-post-image").attr("data-src");
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

    async latest(page: string = "1") {
        try {
            const url = `${this.proxyUrl}${this.parentUrl}/manga/?page=${page}&order=update`;
            const $ = await this.fetchHtml(url);

            const cards = $("#content > div > div.postbody > div.bixbox.seriesearch > div.mrgn > div.listupd > div > div.bsx");
            const content: any[] = [];

            cards.each((_, element) => {
                const title = $(element).find("a").attr("title");
                const id = $(element).find("a").attr("href")?.split("/").slice(-2, -1)[0];
                const image = $(element).find("img.ts-post-image").attr("data-src");
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

    async genres(type: string) {
        try {
            const url = `${this.proxyUrl}${this.parentUrl}/genres/${type}`;
            const $ = await this.fetchHtml(url);

            const cards = $("#content > div > div > div > div.listupd > div > div.bsx");
            const content: any[] = [];

            cards.each((_, element) => {
                const title = $(element).find("a").attr("title");
                const id = $(element).find("a").attr("href")?.split("/").slice(-2, -1)[0];
                const image = $(element).find("img.ts-post-image").attr("data-src");
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
