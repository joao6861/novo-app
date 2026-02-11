import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { placa } = await req.json();

    const response = await fetch("https://api.apibrasil.io/api/consulta/placa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "441924ef-3d2f-42ea-99c0-ed9766281347"
      },
      body: JSON.stringify({
        placa: placa
      }),
    });

    const text = await response.text();

    return NextResponse.json({
      status_api: response.status,
      resposta_bruta: text
    });

  } catch (error: any) {
    return NextResponse.json(
      { erro_real: error.message },
      { status: 500 }
    );
  }
}
