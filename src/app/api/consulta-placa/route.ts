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
        user: "joaopedro6861hotmailcom", 
        token: "da626099-50be-47fe-a8bd-67e3f6289b48"
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