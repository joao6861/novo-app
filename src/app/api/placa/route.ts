import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const runtime = "nodejs";

function normalizarPlaca(placaRaw: string) {
  return placaRaw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placaParam = searchParams.get("placa");

  if (!placaParam) {
    return NextResponse.json(
      { error: "Informe a placa, ex: /api/placa?placa=QUP6E72" },
      { status: 400 }
    );
  }

  const placa = normalizarPlaca(placaParam);

  try {
    const url = `https://www.keplaca.com/placa?placa-fipe=${placa}`;

    const resp = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!resp.ok) {
      return NextResponse.json(
        {
          error: "Erro ao acessar o site Keplaca",
          status: resp.status,
        },
        { status: resp.status }
      );
    }

    const html = await resp.text();
    const $ = cheerio.load(html);

    const titulo = $("h1").first().text().trim();
    const campos: Record<string, string> = {};

    $("table tr").each((_, el) => {
      const label = $(el).find("th").text().trim();
      const value = $(el).find("td").text().trim();

      if (!label || !value) return;

      const chaveNormalizada = label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");

      campos[chaveNormalizada] = value;
    });

    if (!titulo && Object.keys(campos).length === 0) {
      return NextResponse.json(
        {
          error:
            "Não foi possível encontrar informações para esta placa. O layout do site pode ter mudado ou a placa não retornou dados.",
        },
        { status: 404 }
      );
    }

    const resposta = {
      placa,
      titulo,
      dados: campos,
    };

    return NextResponse.json(resposta);
  } catch (err: any) {
    console.error("Erro ao consultar placa:", err);
    return NextResponse.json(
      { error: "Erro interno ao consultar placa" },
      { status: 500 }
    );
  }
}
