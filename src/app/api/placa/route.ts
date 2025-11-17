import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

type PlacaData = {
  placa: string;
  titulo: string | null;
  resumo: string | null;
  marca: string | null;
  modelo: string | null;
  ano: string | null;
  ano_modelo: string | null;
  cor: string | null;
  cilindrada: string | null;
  potencia: string | null;
  combustivel: string | null;
  chassi_final: string | null;
  motor: string | null;
  passageiros: string | null;
  uf: string | null;
  municipio: string | null;
  segmento: string | null;
  especie: string | null;
};

function extractField($: cheerio.CheerioAPI, label: string): string | null {
  // Procura qualquer nó que contenha o texto "Label:"
  const node = $("body")
    .find("*")
    .filter((_, el) => $(el).text().includes(label + ":"))
    .first();

  if (!node.length) return null;

  const text = node.text();
  const idx = text.indexOf(label + ":");
  if (idx === -1) return null;
  return text.slice(idx + label.length + 1).trim() || null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("placa") ?? searchParams.get("plate");

  if (!raw) {
    return NextResponse.json(
      { error: "Placa não informada" },
      { status: 400 }
    );
  }

  const placa = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");

  try {
    const url = `https://www.keplaca.com/placa?placa-fipe=${placa}`;

    const resp = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      cache: "no-store",
    });

    if (!resp.ok) {
      return NextResponse.json(
        {
          error: "Erro ao consultar a placa",
          statusCode: resp.status,
        },
        { status: 502 }
      );
    }

    const html = await resp.text();
    const $ = cheerio.load(html);

    const titulo = $("h1").first().text().trim() || null;

    // Primeiro parágrafo depois de "Detalhes do carro..."
    let resumo: string | null = null;
    const h2Detalhes = $('h2:contains("Detalhes do carro")').first();
    if (h2Detalhes.length) {
      const p = h2Detalhes.nextAll("p").first();
      resumo = p.text().trim() || null;
    }

    const data: PlacaData = {
      placa,
      titulo,
      resumo,
      marca: extractField($, "Marca"),
      modelo: extractField($, "Modelo"),
      ano: extractField($, "Ano"),
      ano_modelo: extractField($, "Ano Modelo"),
      cor: extractField($, "Cor"),
      cilindrada: extractField($, "Cilindrada"),
      potencia: extractField($, "Potencia"),
      combustivel: extractField($, "Combustível"),
      chassi_final: extractField($, "Chassi"),
      motor: extractField($, "Motor"),
      passageiros: extractField($, "Passageiros"),
      uf: extractField($, "UF"),
      municipio: extractField($, "Município"),
      segmento: extractField($, "Segmento"),
      especie: extractField($, "Especie Veiculo"),
    };

    // Se não achou nem marca, provavelmente não encontrou a placa
    if (!data.marca) {
      return NextResponse.json(
        { error: "Placa não encontrada", notFound: true },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, fonte: "keplaca.com", data });
  } catch (err) {
    console.error("Erro ao consultar placa:", err);
    return NextResponse.json(
      { error: "Falha interna ao consultar a placa" },
      { status: 500 }
    );
  }
}
