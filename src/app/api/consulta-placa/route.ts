import { NextRequest, NextResponse } from "next/server";

const REMOTE_ENDPOINT = "https://consultaplaca.store/proxy.php";

async function consultarNoSite(placa: string) {
  const cleanPlate = placa.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  if (!cleanPlate || (cleanPlate.length !== 7 && cleanPlate.length !== 8)) {
    return {
      error: true,
      message: "Placa inválida. Use o formato ABC1234 ou ABC1D23.",
      status: 400,
    };
  }

  // Monta o form igual o site (x-www-form-urlencoded)
  const form = new URLSearchParams();
  form.set("placa", cleanPlate);

  const res = await fetch(REMOTE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Origin: "https://consultaplaca.store",
      Referer: "https://consultaplaca.store/",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: form.toString(),
  });

  const text = await res.text();
  let data: any = null;

  try {
    data = JSON.parse(text);
  } catch {
    // Se não for JSON puro, devolve texto pra debug
    return {
      error: true,
      message: `A resposta do site não é JSON puro (HTTP ${res.status}).`,
      status: res.status || 500,
      raw: text,
    };
  }

  // Aqui só repassamos o JSON recebido dentro de "response"
  // para não quebrar o page.tsx
  return {
    error: false,
    message: "Consulta feita via consultaplaca.store",
    response: data,
    raw: data,
    status: 200,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const placa = body?.placa as string | undefined;

    if (!placa) {
      return NextResponse.json(
        {
          error: true,
          message: "Campo 'placa' é obrigatório no corpo da requisição.",
        },
        { status: 400 }
      );
    }

    const result = await consultarNoSite(placa);

    if (result.error) {
      return NextResponse.json(
        {
          error: true,
          message: result.message,
          raw: result.raw,
        },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("Erro interno em /api/consulta-placa (POST):", err);
    return NextResponse.json(
      {
        error: true,
        message: "Erro interno ao consultar a placa.",
      },
      { status: 500 }
    );
  }
}

// GET /api/consulta-placa?placa=ABC1D23 para testar direto no navegador
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placa = searchParams.get("placa") || undefined;

  if (!placa) {
    return NextResponse.json(
      {
        error: true,
        message: "Informe a placa pelo parâmetro ?placa=ABC1D23.",
      },
      { status: 400 }
    );
  }

  try {
    const result = await consultarNoSite(placa);

    if (result.error) {
      return NextResponse.json(
        {
          error: true,
          message: result.message,
          raw: result.raw,
        },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("Erro interno em /api/consulta-placa (GET):", err);
    return NextResponse.json(
      {
        error: true,
        message: "Erro interno ao consultar a placa.",
      },
      { status: 500 }
    );
  }
}
