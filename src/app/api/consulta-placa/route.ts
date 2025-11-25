import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const placa = (body?.placa || "").toString().toUpperCase().trim();

    if (!placa) {
      return NextResponse.json(
        { error: true, message: "Placa não informada." },
        { status: 400 }
      );
    }

    // 👉 SUBSTITUA AQUI PELA SUA API DE PLACAS
    const API_URL = process.env.PLATE_API_URL;      // ex: "https://minhaapi.com/consulta"
    const API_TOKEN = process.env.PLATE_API_TOKEN;  // seu token/chave

    if (!API_URL || !API_TOKEN) {
      console.error("Env de placa faltando: PLATE_API_URL ou PLATE_API_TOKEN");
      return NextResponse.json(
        {
          error: true,
          message:
            "Configuração do servidor incompleta (PLATE_API_URL / PLATE_API_TOKEN).",
        },
        { status: 500 }
      );
    }

    // 👉 MONTE A URL EXTERNA DE ACORDO COM A SUA API
    const url = `${API_URL}?placa=${encodeURIComponent(
      placa
    )}&token=${encodeURIComponent(API_TOKEN)}`;

    const externalRes = await fetch(url, {
      method: "GET",
      // se sua API exigir cabeçalho específico, configure aqui
      headers: {
        Accept: "application/json",
      },
    });

    const text = await externalRes.text();
    let data: any = null;

    try {
      data = JSON.parse(text);
    } catch {
      // se não for JSON, devolve o texto bruto
      data = text;
    }

    if (!externalRes.ok) {
      console.error("Erro da API de placas:", externalRes.status, data);
      return NextResponse.json(
        {
          error: true,
          message:
            (data &&
              typeof data === "object" &&
              (data.message || data.error || data.erro)) ||
            "Erro ao consultar a API de placas.",
          response: data,
        },
        { status: externalRes.status }
      );
    }

    // Normaliza o retorno para o front:
    // o page.tsx espera um objeto { error, message, response }
    return NextResponse.json(
      {
        error: false,
        message: "OK",
        response: data.response ?? data,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Erro inesperado em /api/consulta-placa:", err);
    return NextResponse.json(
      { error: true, message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
