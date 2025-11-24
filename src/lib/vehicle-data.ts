// src/lib/vehicle-data.ts

import rawVehicles from "@/data/veiculos_database.json";

// ---- Tipos auxiliares ----

export interface FiltroItem {
  marca: string;
  codigo: string;
}

export interface FiltrosVeiculo {
  oleo: FiltroItem[];
  ar: FiltroItem[];
  cabine: FiltroItem[];
  combustivel: FiltroItem[];
  cambio_auto: FiltroItem[];
}

// Estrutura completa de cada veículo vindo do JSON
export interface VeiculoDB {
  marca: string;
  veiculo_raw: string;
  modelo: string;

  motor_litros?: string;
  motor_valvulas?: string;
  potencia_cv?: number;
  combustivel?: string;
  motor_info?: string;
  cambio_info?: string;

  ano_de?: number;
  ano_ate?: number;

  oleo_motor_litros?: number;
  oleo_motor_viscosidade?: string;
  oleo_motor_especificacao?: string;

  oleo_cambio_manual_litros?: number;
  oleo_cambio_manual_viscosidade?: string;
  oleo_cambio_manual_especificacao?: string;

  oleo_cambio_auto_total_litros?: number;
  oleo_cambio_auto_parcial_litros?: number;
  oleo_cambio_auto_especificacao?: string;

  oleo_dif_dianteiro_litros?: number;
  oleo_dif_dianteiro_visco?: string;
  oleo_dif_dianteiro_especificacao?: string;

  oleo_dif_traseiro_litros?: number;
  oleo_dif_traseiro_visco?: string;
  oleo_dif_traseiro_especificacao?: string;

  oleo_caixa_transfer_litros?: number;
  oleo_caixa_transfer_visco?: string;
  oleo_caixa_transfer_especificacao?: string;

  aditivo_radiador_litros?: number;
  aditivo_radiador_tipo?: string;
  aditivo_radiador_cor?: string;

  fluido_freio_litros?: number;
  fluido_freio_tipo?: string;

  fluido_direcao_litros?: number;
  fluido_direcao_tipo?: string;

  bateria_capacidade_ah?: number;
  bateria_cca?: number;
  bateria_polo_positivo?: string;

  filtros: FiltrosVeiculo;
}

// ---- Base carregada do JSON ----

// Se o JSON estiver no formato que montamos, isso já tipa tudo bonitinho.
export const veiculosDB: VeiculoDB[] = rawVehicles as VeiculoDB[];

// ---- Funções de ajuda pra usar no app ----

/**
 * Retorna todas as marcas disponíveis, sem repetir, ordenadas.
 */
export function getMarcas(): string[] {
  const set = new Set<string>();
  for (const v of veiculosDB) {
    if (v.marca) {
      set.add(v.marca.toUpperCase());
    }
  }
  return Array.from(set).sort();
}

/**
 * Retorna os modelos de uma marca, sem repetir, ordenados.
 */
export function getModelosByMarca(marca: string): string[] {
  const marcaUp = marca.toUpperCase();
  const set = new Set<string>();

  for (const v of veiculosDB) {
    if (v.marca.toUpperCase() === marcaUp && v.modelo) {
      set.add(v.modelo.toUpperCase());
    }
  }

  return Array.from(set).sort();
}

/**
 * Retorna os veículos (linhas) de uma marca + termo de modelo/descrição.
 * Você pode usar isso pra busca por texto (ex.: "1.0 12V", "2.0 FLEX", etc.).
 */
export function buscarVeiculosPorMarcaModelo(
  marca: string,
  termoModelo: string
): VeiculoDB[] {
  const marcaUp = marca.toUpperCase();
  const termoUp = termoModelo.toUpperCase().trim();

  return veiculosDB.filter((v) => {
    if (v.marca.toUpperCase() !== marcaUp) return false;

    const texto = `${v.veiculo_raw} ${v.modelo}`.toUpperCase();
    return texto.includes(termoUp);
  });
}

/**
 * Retorna todos os registros de um veículo exato (caso você use
 * a descrição completa veiculo_raw como chave).
 */
export function buscarPorDescricaoExata(descricao: string): VeiculoDB[] {
  const descUp = descricao.toUpperCase().trim();
  return veiculosDB.filter(
    (v) => v.veiculo_raw.toUpperCase().trim() === descUp
  );
}

/**
 * Retorna apenas os filtros WEGA de um veículo (exemplo de uso específico).
 */
export function getFiltrosWega(veiculo: VeiculoDB): FiltrosVeiculo {
  const filtrarWega = (lista: FiltroItem[]) =>
    (lista || []).filter(
      (f) => f.marca && f.marca.toUpperCase().includes("WEGA")
    );

  return {
    oleo: filtrarWega(veiculo.filtros?.oleo || []),
    ar: filtrarWega(veiculo.filtros?.ar || []),
    cabine: filtrarWega(veiculo.filtros?.cabine || []),
    combustivel: filtrarWega(veiculo.filtros?.combustivel || []),
    cambio_auto: filtrarWega(veiculo.filtros?.cambio_auto || []),
  };
}
