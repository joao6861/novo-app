import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { placa } = await req.json();

    if (!placa) {
      return NextResponse.json(
        { success: false, error: "Placa não informada" },
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
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
          "Accept": "*/*",
          "Origin": "https://consultaplaca.store",
          "Referer": "https://consultaplaca.store/"
        },
        body: new URLSearchParams({
          placa: placa
        }),
        cache: "no-store"
      }
    );

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Erro no proxy externo" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: text
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro interno na consulta" },
      { status: 500 }
    );
  }
}
