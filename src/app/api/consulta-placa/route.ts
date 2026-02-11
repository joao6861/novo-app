import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { placa } = await req.json();

    if (!placa) {
      return NextResponse.json(
        { error: "Placa não informada" },
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
        body: new URLSearchParams({
          placa,
          user: "da626099-50be-47fe-a8bd-67e3f6289b48",
          token: "135213521352"
        }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json({
      response: data
    });

  } catch (error: any) {
    console.error("Erro na API:", error);

    return NextResponse.json(
      { error: "Erro ao consultar a placa." },
      { status: 500 }
    );
  }
}
