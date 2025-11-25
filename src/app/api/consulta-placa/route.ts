import { NextResponse } from "next/server";

// =====================================================
//  AQUI VOCÊ COLOCA A MESMA URL E O MESMO TOKEN DE ANTES
//  (direto no código, sem variável de ambiente)
// =====================================================

// EXEMPLO – TROQUE PELO QUE VOCÊ JÁ USAVA:
const API_URL = "https://SUA-API-DE-PLACAS.com/consulta"; // ⬅ URL da sua API de placas
const API_TOKEN = "SEU_TOKEN_AQUI";                        // ⬅ token / chave da API

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const placa = (body?.placa || "").toString().toUpperCase().trim();

    if (!placa) {
      return NextResponse.json(
        { error: true, message: "Placa não informada.", response: null },
        { status: 400 }
      );
    }

    // =====================================================
    // MONTA A CHAMADA EXTERNA IGUAL VOCÊ TINHA ANTES
    // (aqui estou usando o modelo mais comum: GET com ?placa=&token=)
    // Se a sua API era diferente (POST, header Authorization etc.),
    // você só ajusta ESSA parte, o resto pode ficar igual.
    // =====================================================

    const url = `${API_URL}?placa=${encodeURIComponent(
      placa
    )}&token=${encodeURIComponent(API_TOKEN)}`;

    const externalRes = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        // Se ANTES você usava header em vez de query, seria algo assim:
        // Authorization: `Bearer ${API_TOKEN}`,
        // e AÍ você tira o "&token=..." da URL lá em cima.
      },
    });

    const text = await externalRes.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    // 🔹 IMPORTANTE:
    // Se a sua API já retorna { error, message, response, ... },
    // a gente simplesmente DEVOLVE isso pro front,
    // sem mudar o formato — igual estava antes.
    return NextResponse.json(data, { status: externalRes.status });
  } catch (err) {
    console.error("Erro inesperado em /api/consulta-placa:", err);
    return NextResponse.json(
      {
        error: true,
        message: "Erro interno do servidor.",
        response: null,
      },
      { status: 500 }
    );
  }
}
