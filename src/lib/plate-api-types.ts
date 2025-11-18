export interface PlateApiRoot {
  error: boolean;
  message: string;
  response: PlateApiResponse;
  api_limit: number;
  api_limit_for: string;
  api_limit_used: number;
}

export interface PlateApiResponse {
  MARCA: string;
  MODELO: string;
  SUBMODELO: string;
  VERSAO: string;

  ano: string;
  anoModelo: string;
  chassi: string;
  codigoRetorno: string;
  codigoSituacao: string;
  cor: string;
  data: string;
  dataatualizacaoalarme: string;
  dataatualizacaocaracteristicasveiculo: string;
  dataatualizacaoroubofurto: string;
  limite_restricao_trib: string;

  placa: string;
  placa_modelo_antigo: string;
  placa_modelo_novo: string;
  placa_nova: string;

  extra: PlateApiExtra;

  modelo: string;
  marca: string;
  municipio: string;
  uf: string;
  uf_placa: string;
  combustivel: string;
  potencia: string;
  capacidade_carga: string;

  nacionalidade: { nacionalidade: string } | null;
  linha: string;
  carroceria: string | null;
  caixa_cambio: string;
  eixo_traseiro_dif: string;
  terceiro_eixo: string;
  ano_modelo: string;

  tipo_veiculo: { tipo_veiculo: string } | null;
  marca_modelo: PlateApiMarcaModelo | null;
  cor_veiculo: { cor: string } | null;

  quantidade_passageiro: string;
  situacao_chassi: string;
  eixos: string;
  tipo_montagem: string;
  ultima_atualizacao: string;
  cilindradas: string;
  situacao_veiculo: string;

  listamodelo: string[][];
  server: string;
  version: string;
  info: string;
  logo: string;
  status_code: number;

  fipe: { dados: any[] };
  multas: { dados: any[] };
}

export interface PlateApiExtra {
  ano_fabricacao: string;
  ano_modelo: string;
  caixa_cambio: string;
  cap_maxima_tracao: string;
  capacidade_carga: string;
  chassi: string;
  cilindradas: string;
  combustivel: string;
  cor_veiculo: { cor: string } | null;
  data_atualizacao: string;
  eixos: string;
  faturado: string;
  tipo_doc_faturado: { tipo_pessoa: string } | null;
  uf_faturado: string;
  tipo_doc_prop: { tipo_pessoa: string } | null;
  uf_placa: string;
  uf: string;
  linha: string;
  motor: string;
  municipio: { municipio: string; uf: string } | null;
  carroceria: string | null;
  nacionalidade: string;
  peso_bruto_total: string;
  placa: string;
  placa_modelo_antigo: string;
  placa_modelo_novo: string;
  placa_nova: string;
  potencia: string;
  quantidade_passageiro: string;
  renavam: string | null;
  marca_modelo: PlateApiMarcaModelo | null;
  restricao1: { restricao: string } | null;
  restricao2: { restricao: string } | null;
  restricao3: { restricao: string } | null;
  restricao4: { restricao: string } | null;
}

export interface PlateApiMarcaModelo {
  modelo: string;
  marca: string;
  segmento: string;
  versao: string;
}
