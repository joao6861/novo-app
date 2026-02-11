import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { placa } = await req.json();

    if (!placa) {
      return NextResponse.json({ error: "Placa não informada" }, { status: 400 });
    }

    const response = await fetch(
      "https://consultaplaca.store/proxy.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
        },
        body: new URLSearchParams({ placa }),
        cache: "no-store"
      }
    );

    const html = await response.text();

    const $ = cheerio.load(html);

    // 🔎 AJUSTE AQUI CONFORME A ESTRUTURA DO SITE
    const marca = $("td:contains('Marca')").next().text().trim();
    const modelo = $("td:contains('Modelo')").next().text().trim();
    const ano = $("td:contains('Ano')").next().text().trim();

    return NextResponse.json({
      success: true,
      marca,
      modelo,
      ano
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar consulta" },
      { status: 500 }
    );
  }
}
