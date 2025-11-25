import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api.consultarplaca.com.br/v2/consultarPlaca";

// 🔐 ALTERE AQUI: use o MESMO e-mail da sua conta ConsultarPlaca
//     e a API KEY gerada no menu "API" do site.
const API_USER = "SEU_EMAIL_DA_CONTA_NO_CONSULTARPLACA";
const API_KEY = "SUA_API_KEY_GERADA_NO_PAINEL";

// Normaliza / mapeia a resposta do Consultar Placa para o formato
// que o seu front já estava usando.
function mapConsultarPlacaToLegacyResponse(apiData: any, placaConsulta: string) {
  const dados = apiData?.dados?.informacoes_veiculo || {};
  const dv = dados.dados_veiculo || {};
  const dt = dados.dados_tecnicos || {};
  const dc = dados.dados_carga || {};

  const placa = dv.placa || placaConsulta;

  const response = {
    placa,
    placa_modelo_antigo: placa,
    placa_modelo_novo: placa,
    placa_nova: "f",

    chassi: dv.chassi || null,
    ano: dv.ano_fabricacao || null,
    anoModelo: dv.ano_modelo || null,

    marca: dv.marca || null,
    modelo: dv.modelo || null,
    marca_modelo: {
      marca: dv.marca || null,
      modelo: dv.modelo || null,
      segmento: dv.segmento || null,
      versao: null,
    },

    cor: dv.cor || null,
    cor_veiculo: {
      cor: dv.cor || null,
    },

    segmento: dv.segmento || null,
    combustivel: dv.combustivel || null,
    potencia: dt.potencia || null,
    cilindradas: dt.cilindradas || null,

    municipio: dv.municipio || null,
    uf: dv.uf_municipio || null,
    uf_placa: dv.uf_municipio || null,

    nacionalidade: {
      nacionalidade: dv.procedencia || null,
    },

    quantidade_passageiro: dc.capacidade_passageiro || null,
    eixos: dc.numero_eixos || null,
    capacidade_carga: null,

    tipo_veiculo: {
      tipo_veiculo: dt.tipo_veiculo || null,
    },

    extra: {
      placa,
      placa_modelo_antigo: placa,
      placa_modelo_novo: placa,
      placa_nova: "f",

      ano_fabricacao: dv.ano_fabricacao || null,
      ano_modelo: dv.ano_modelo || null,

      chassi: dv.chassi || null,
      motor: dt.numero_motor || null,
      caixa_cambio: dt.numero_caixa_cambio || null,

      cor_veiculo: {
        cor: dv.cor || null,
      },

      combustivel: dv.combustivel || null,
      potencia: dt.potencia || null,
      cilindradas: dt.cilindradas || null,
      quantidade_passageiro: dc.capacidade_passageiro || null,
      eixos: dc.numero_eixos || null,

      cap_maxima_tracao: dc.capacidade_maxima_tracao || null,
      capacidade_carga: null,
      peso_bruto_total: null,

      nacionalidade: dv.procedencia || null,

      municipio: {
        municipio: dv.municipio || null,
        uf: dv.uf_municipio || null,
      },

      uf: dv.uf_municipio || null,
      uf_placa: dv.uf_municipio || null,

      renavam: null, // essa rota básica não traz renavam

      faturado: null,
      tipo_doc_faturado: {
        tipo_pessoa: null,
      },
      tipo_doc_prop: {
        tipo_pessoa: null,
      },

      data_atualizacao: apiData?.data_solicitacao || null,

      restricao1: { restricao: "" },
      restricao2: { restricao: "" },
      restricao3: { restricao: "" },
      restricao4: { restricao: "" },
    },

    codigoRetorno: apiData?.status === "ok" ? "0" : "1",
    codigoSituacao: "0",
    situacao_chassi: null,
    situacao_veiculo: null,

    linha: null,
    caixa_cambio: dt.numero_caixa_cambio || null,
    eixo_traseiro_dif: null,
    terceiro_eixo: null,

    ultima_atualizacao: apiData?.data_solicitacao || null,
    info: apiData?.data_solicitacao || null,

    fipe: { dados: [] },
    multas: { dados: [] },

    server: "https://api.consultarplaca.com.br",
    version: "v2",
    logo: null,
  };

  return response;
}

async function consultarPlacaExterna(placa: string) {
  const cleanPlate = placa.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  if (!cleanPlate || (cleanPlate.length !== 7 && cleanPlate.length !== 8)) {
    return {
      error: true,
      message:
        "Placa inválida. Use o formato ABC1234 ou ABC1D23.",
      status: 400,
    };
  }

  const credentials = Buffer.from(`${API_USER}:${API_KEY}`).toString("base64");
  const url = `${API_URL}?placa=${encodeURIComponent(cleanPlate)}`;

  // 🔍 Faz a requisição e guarda texto bruto pra debug
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${credentials}`,
      Accept: "application/json",
    },
  });

  const text = await res.text();
  let data: any = null;

  try {
    data = JSON.parse(text);
  } catch {
    console.error(
      "Resposta NÃO-JSON da API Consultar Placa:",
      `HTTP ${res.status}`,
      text
    );
  }

  // Se deu erro HTTP ou não deu pra parsear JSON
  if (!res.ok || !data) {
    return {
      error: true,
      message:
        data?.mensagem ||
        `Erro ao consultar a placa na API Consultar Placa. HTTP ${res.status}.`,
      status: res.status || 500,
      raw: text,
    };
  }

  if (data.status !== "ok") {
    return {
      error: true,
      message: data.mensagem || "Consulta não retornou dados.",
      status: 400,
      raw: data,
    };
  }

  const mappedResponse = mapConsultarPlacaToLegacyResponse(
    data,
    cleanPlate
  );

  return {
    error: false,
    message: data.mensagem || "Consulta realizada com sucesso.",
    response: mappedResponse,
    raw: data,
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

    const result = await consultarPlacaExterna(placa);

    if (result.error) {
      return NextResponse.json(
        { error: true, message: result.message, raw: result.raw },
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
    const result = await consultarPlacaExterna(placa);

    if (result.error) {
      return NextResponse.json(
        { error: true, message: result.message, raw: result.raw },
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
