import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { placa } = await req.json();

    if (!placa) {
      return NextResponse.json(
        { error: "Placa é obrigatória" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.apibrasil.io/api/consulta/placa", {
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

    const text = await response.text();

    return NextResponse.json({
      status_api: response.status,
      resposta_bruta: text
    });

  } catch (error: any) {
    return NextResponse.json(
      { error_real: error.message },
      { status: 500 }
    );
  }
}
