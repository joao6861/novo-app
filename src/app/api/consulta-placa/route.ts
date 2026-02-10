import { NextRequest, NextResponse } from "next/server";

const REMOTE_ENDPOINT = "https://consultaplaca.store/proxy.php";

/**
 * Consulta a placa no consultaplaca.store (proxy.php)
 * e devolve NO MESMO FORMATO que a API antiga do apiveiculos,
 * para o page.tsx não precisar mudar nada.
 */
async function consultarNoSite(placa: string) {
  const cleanPlate = placa.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  if (!cleanPlate || (cleanPlate.length !== 7 && cleanPlate.length !== 8)) {
    return {
      error: true,
      message: "Placa inválida. Use o formato ABC1234 ou ABC1D23.",
      status: 400,
    };
  }

  // Monta o form igual o site: x-www-form-urlencoded com "placa"
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
    // Se não for JSON puro, erro
    return {
      error: true,
      message: `A resposta do site não é JSON puro (HTTP ${res.status}).`,
      status: res.status || 500,
      raw: text,
    };
  }

  // Esperado a partir do consultaplaca:
  // {
  //   error: false,
  //   message: "Requisição processada com sucesso",
  //   response: { ...DADOS DO CARRO... },
  //   api_limit: ...,
  //   api_limit_for: ...,
  //   api_limit_used: ...
  // }

  if (!res.ok || data.error) {
    return {
      error: true,
      message: data?.message || data?.mensagem || "Erro na consulta.",
      status: res.status || 400,
      raw: data,
    };
  }

  // 🔴 AQUI É O PULO DO GATO:
  // Transformo o retorno em algo idêntico à API antiga (apiveiculos),
  // ou seja: um único "response" com os campos do veículo.
  const mapped = {
    error: false,
    message: data.message || "Requisição processada com sucesso",
    response: data.response, // <- AGORA é o objeto que tem MARCA, MODELO, extra, etc
    api_limit: data.api_limit,
    api_limit_for: data.api_limit_for,
    api_limit_used: data.api_limit_used,
    raw: data, // guardo o original se quiser depurar depois
  };

  return mapped;
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
          raw: (result as any).raw,
        },
        { status: (result as any).status || 400 }
      );
    }

    // Devolvemos exatamente no formato que o page.tsx espera
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

// GET /api/consulta-placa?placa=ABC1D23 (pra testar direto no navegador)
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
          raw: (result as any).raw,
        },
        { status: (result as any).status || 400 }
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
