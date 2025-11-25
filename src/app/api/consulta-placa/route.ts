import { NextRequest, NextResponse } from "next/server";

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

    // ============================================
    //  AQUI VOCÊ COLOCA A MESMA API QUE JÁ USAVA
    // ============================================
    // Exemplo genérico – TROQUE pelos dados reais:
    const API_URL = "https://SUA-API-DE-PLACAS.com/consulta"; // ⬅ coloque aqui a URL que funcionava
    const API_TOKEN = "SEU_TOKEN_AQUI";                        // ⬅ coloque aqui o token/chave

    // Se sua API já recebia assim (GET com ?placa=&token=), esse exemplo funciona:
    const url = `${API_URL}?placa=${encodeURIComponent(
      placa
    )}&token=${encodeURIComponent(API_TOKEN)}`;

    const externalRes = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        // Se a sua API usava Authorization em vez de query string,
        // você pode fazer algo assim:
        // Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    const text = await externalRes.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    // Algumas APIs já retornam { error, message, response }
    const erro = !!(data && typeof data === "object" && data.error);
    const mensagem =
      (data && typeof data === "object" && data.message) ||
      (typeof data === "string" ? data : "");
    const responseField =
      data && typeof data === "object" && "response" in data
        ? data.response
        : data;

    if (!externalRes.ok || erro) {
      console.error("Erro API placas:", externalRes.status, data);
      return NextResponse.json(
        {
          error: true,
          message:
            mensagem || "Erro ao consultar a API de placas.",
          response: responseField,
        },
        { status: externalRes.status }
      );
    }

    // Normaliza para o formato que o page.tsx espera
    return NextResponse.json(
      {
        error: false,
        message: mensagem || "OK",
        response: responseField,
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
