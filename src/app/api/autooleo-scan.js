import fetch from "node-fetch";
import cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) return res.status(400).json({ error: "Cookie faltando" });

    const resp = await fetch("https://autooleo.com/tabela", {
      headers: { Cookie: cookie }
    });

    const html = await resp.text();
    const $ = cheerio.load(html);

    let vehicles = [];

    $(".vehicle-card").each((i, el) => {
      const name = $(el).find(".title").text().trim();
      const oil = $(el).find(".oil-info").text().trim();
      const filter = $(el).find(".filter-info").text().trim();

      vehicles.push({ name, oil, filter });
    });

    return res.status(200).json(vehicles);

  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
}
