import { NextRequest, NextResponse } from "next/server";
import { consultarPlaca } from "@/lib/placa-api";

// Garantir que rode no Node (Edge dá pau com APIs dinâmicas às vezes)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("placa") ?? searchParams.get("plate");

  if (!raw) {
    return NextResponse.json(
      { error: "Placa não informada" },
      { status: 400 }
    );
  }

  const placa = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");

  try {
    // Agora usando a integração OFICIAL da APIBrasil v2 via lib
    const result = await consultarPlaca(placa);

    if (!result) {
      return NextResponse.json(
        { error: "Placa não encontrada", notFound: true },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      fonte: "APIBrasil Oficial",
      data: {
        ...result,
        titulo: `${result.marca} ${result.modelo} (${result.ano})`
      }
    });
  } catch (err: any) {
    console.error("Erro ao consultar placa via APIBrasil:", err);
    return NextResponse.json(
      {
        error: "Falha ao consultar a placa via APIBrasil",
        details: err.message
      },
      { status: 502 }
    );
  }
}
