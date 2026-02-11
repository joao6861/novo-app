import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { placa } = await req.json();

    const response = await fetch("https://apibrasil.com.br/api/consulta/placa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 441924ef-3d2f-42ea-99c0-ed9766281347"
      },
      body: JSON.stringify({
        placa: placa,
        id: "da626099-50be-47fe-a8bd-67e3f6289b48"
      }),
    });

    const data = await response.text();

    return NextResponse.json({
      status_api: response.status,
      resposta: data
    });

  } catch (error: any) {
    return NextResponse.json(
      { erro_conexao: error.message },
      { status: 500 }
    );
  }
}
