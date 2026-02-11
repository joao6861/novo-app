import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { placa } = await req.json();

    if (!placa) {
      return NextResponse.json(
        { error: true, message: "Placa obrigatória" },
        { status: 400 }
      );
    }

    const response = await fetch("https://app.apibrasil.io/api/consulta/placa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        placa: placa,
        user: "joaopedro6861hotmailcom", // Seu usuário
        token: "441924ef-3d2f-42ea-99c0-ed9766281347" // Seu token (decive token)
      }),
    });

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error("Erro na consulta:", error);

    return NextResponse.json(
      { error: true, message: "Erro interno ao consultar placa" },
      { status: 500 }
    );
  }
}