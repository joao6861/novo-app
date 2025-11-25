import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api.consultarplaca.com.br/v2/consultarPlaca";

// 🔐 Coloque aqui SEU e-mail e sua API KEY do Consultar Placa
// (Autenticação Basic Auth: email como usuário e api_key como senha)
const API_USER = "SEU_EMAIL_CADASTRADO_AQUI";
const API_KEY = "SUA_API_KEY_AQUI";

// Normaliza e extrai os campos principais da resposta do Consultar Placa
function mapConsultarPlacaToLegacyResponse(apiData: any, placaConsulta: string) {
  const dados = apiData?.dados?.informacoes_veiculo || {};
  const dv = dados.dados_veiculo || {};
  const dt = dados.dados_tecnicos || {};
  const dc = dados.dados_carga || {};

  const placa = dv.placa || placaConsulta;

  const response = {
    // CAMPOS PRINCIPAIS
    placa: placa,
    placa_modelo_antigo: placa,
    placa_modelo_novo: placa,
    placa_nova: "f",

    chassi: dv.chassi || null,
    ano: dv.ano_fabricacao || null,
    anoModelo: dv.ano_modelo || null,

    marca: dv.marca || null,
    modelo: dv.modelo || null,
    // estrutura “marca_modelo” parecida com a API antiga
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

    // TIPO DO VEÍCULO
    tipo_veiculo: {
      tipo_veiculo: dt.tipo_veiculo || null,
    },

    // CAMPOS “EXTRA” (para manter compatibilidade com o page.tsx atual)
    extra: {
      placa: placa,
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

      // 🔹 A API básica não traz Renavam -> deixamos null
      renavam: null,

      // campos de faturado / proprietário não vêm nessa rota
      faturado: null,
      tipo_doc_faturado: {
        tipo_pessoa: null,
      },
      tipo_doc_prop: {
        tipo_pessoa: null,
      },

      // datas de atualização (a API retorna data_solicitacao)
      data_atualizacao: apiData?.data_solicitacao || null,

      // restrições (não vêm aqui – ficam como vazias)
      restricao1: { restricao: "" },
      restricao2: { restricao: "" },
      restricao3: { restricao: "" },
      restricao4: { restricao: "" },
    },

    // CAMPOS “STATUS” / METADADOS
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

    // FIPE / MULTAS – essa rota básica não traz esses dados, deixamos vazio
    fipe: { dados: [] },
    multas: { dados: [] },

    // LOGO e SERVER (opcional – você pode trocar a logo se quiser)
    server: "https://api.consultarplaca.com.br",
    version: "v2",
    logo: null,
  };

  return response;
}

// Função auxiliar: executa a consulta na API Consultar Placa
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

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${credentials}`,
      Accept: "application/json",
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    return {
      error: true,
      message:
        data?.mensagem ||
        "Erro ao consultar a placa na API Consultar Placa.",
      status: res.status || 500,
    };
  }

  // A própria API já sinaliza sucesso com status = "ok"
  if (data.status !== "ok") {
    return {
      error: true,
      message: data.mensagem || "Consulta não retornou dados.",
      status: 400,
    };
  }

  const mappedResponse = mapConsultarPlacaToLegacyResponse(
    data,
    cleanPlate
  );

  // Mantemos o formato { error: false, message, response, ... }
  return {
    error: false,
    message: data.mensagem || "Consulta realizada com sucesso.",
    response: mappedResponse,
    raw: data,
  };
}

// 🔹 POST /api/consulta-placa  (usado pelo seu page.tsx)
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
        { error: true, message: result.message },
        { status: result.status || 400 }
      );
    }

    // Devolvemos no mesmo padrão que o seu front já espera:
    // { error: false, message, response, raw }
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("Erro interno em /api/consulta-placa:", err);
    return NextResponse.json(
      {
        error: true,
        message: "Erro interno ao consultar a placa.",
      },
      { status: 500 }
    );
  }
}

// (Opcional) também aceitar GET /api/consulta-placa?placa=ABC1D23
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
        { error: true, message: result.message },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("Erro interno em GET /api/consulta-placa:", err);
    return NextResponse.json(
      {
        error: true,
        message: "Erro interno ao consultar a placa.",
      },
      { status: 500 }
    );
  }
}
