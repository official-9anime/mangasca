import express from "express";
import Asurascans from "./asurascans";

const app = express();
const port = process.env.PORT || 3000;
const asurascans = new Asurascans();

app.get("/", (req, res) => {
  res.send("Welcome to the Asurascans API");
});

app.get("/search", async (req, res) => {
  const query = req.query.q as string;
  if (!query) {
    return res.status(400).send({ error: "Query parameter 'q' is required" });
  }

  try {
    const data = await asurascans.search(query);
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/info/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await asurascans.info(id);
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/pages/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await asurascans.pages(id);
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/popular", async (req, res) => {
  try {
    const data = await asurascans.popular();
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/latest", async (req, res) => {
  const page = req.query.page as string || "1";
  try {
    const data = await asurascans.latest(page);
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/genres/:type", async (req, res) => {
  const type = req.params.type;
  try {
    const data = await asurascans.genres(type);
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
