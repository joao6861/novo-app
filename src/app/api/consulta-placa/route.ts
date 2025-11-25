import { NextRequest, NextResponse } from "next/server";

type PlateApiRoot = {
  error: boolean;
  message: string;
  response: any;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const placa = (body?.placa || "").toString().toUpperCase().trim();

    if (!placa) {
      return NextResponse.json(
        { error: true, message: "Placa não informada.", response: null },
        { status: 400 }
      );
    }

    // 👉 CONFIGURAÇÃO DA SUA API DE PLACAS
    // Coloque na Vercel (ou .env.local):
    // PLATE_API_URL  -> URL base da API
    // PLATE_API_TOKEN -> seu token / chave de acesso
    const API_URL = process.env.PLATE_API_URL;
    const API_TOKEN = process.env.PLATE_API_TOKEN;

    if (!API_URL || !API_TOKEN) {
      console.error("Faltando PLATE_API_URL ou PLATE_API_TOKEN nas envs.");
      return NextResponse.json(
        {
          error: true,
          message:
            "Configuração do servidor incompleta (PLATE_API_URL / PLATE_API_TOKEN).",
          response: null,
        },
        { status: 500 }
      );
    }

    // 👉 MONTE A URL CONFORME A SUA API DE PLACAS
    // Exemplo de API que recebe GET com query ?placa=...&token=...
    const url = `${API_URL}?placa=${encodeURIComponent(
      placa
    )}&token=${encodeURIComponent(API_TOKEN)}`;

    const externalRes = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const text = await externalRes.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    // Se a API externa já manda { error, message, response }
    const maybePlate = data as Partial<PlateApiRoot>;

    if (!externalRes.ok || maybePlate.error) {
      console.error("Erro API placas:", externalRes.status, data);
      return NextResponse.json(
        {
          error: true,
          message:
            maybePlate.message ||
            (typeof data === "string"
              ? data
              : "Erro ao consultar a API de placas."),
          response: maybePlate.response ?? data,
        },
        { status: externalRes.status }
      );
    }

    // Normaliza sempre para o formato que o page.tsx espera
    return NextResponse.json(
      {
        error: false,
        message: maybePlate.message || "OK",
        response: maybePlate.response ?? data,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erro inesperado em /api/consulta-placa:", err);
    return NextResponse.json(
      { error: true, message: "Erro interno do servidor.", response: null },
      { status: 500 }
    );
  }
}
