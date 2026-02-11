import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { placa } = await req.json();

    if (!placa) {
      return NextResponse.json(
        { error: true, message: "Placa não informada." },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://consultaplaca.store/proxy.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        body: new URLSearchParams({ placa }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    // 🔥 GARANTIR FORMATO CORRETO PARA O FRONT
    return NextResponse.json({
      response: data,
    });

  } catch (error: any) {
    console.error("Erro na API:", error);

    return NextResponse.json(
      {
        error: true,
        message: "Erro ao consultar a placa.",
      },
      { status: 500 }
    );
  }
}
