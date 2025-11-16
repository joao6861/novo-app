// src/lib/vehicle-data.ts

export type VehicleModel = {
  /** Código interno seu (pode ser qualquer coisa única) */
  code: string;
  /** Texto EXATO do modelo, igual ao que aparece na tabela / Auto Óleo */
  label: string;
};

export type VehicleBrand = {
  brand: string; // ex: "FIAT", "RENAULT"
  models: VehicleModel[];
};

/**
 * AQUI você vai preenchendo com TODAS as marcas e modelos.
 * Eu deixei alguns exemplos só pra você entender o formato.
 */
export const vehicleBrands: VehicleBrand[] = [
  {
    brand: "FIAT",
    models: [
      {
        code: "FASTBACK_13_T270_2023_2025",
        label:
          "FASTBACK 1.3 16V 185CV FLEX MOTOR STELLANTIS T270 CÂMBIO AUTOMÁTICO AW60T ANO 2023 ATÉ 2025",
      },
      {
        code: "PULSE_13_TURBO_2023",
        label: "PULSE 1.3 16V TURBO FLEX ANO 2023",
      },
      {
        code: "PULSE_10_2022",
        label: "PULSE 1.0 12V FLEX ANO 2022",
      },
      // ➜ AQUI você continua com todos os FIAT exatamente como na tabela / Auto Óleo
    ],
  },
  {
    brand: "RENAULT",
    models: [
      {
        code: "SANDERO_10_3CIL_2020",
        label: "SANDERO 1.0 12V 3 CILINDROS FLEX ANO 2020",
      },
      {
        code: "KWID_10_3CIL_2022",
        label: "KWID 1.0 12V 3 CILINDROS FLEX ANO 2022",
      },
      // ➜ Coloque aqui todos os Renault exatamente como aparecem na tabela / Auto Óleo
    ],
  },
  // ➜ Depois você adiciona VW, CHEVROLET, HONDA, etc.
];

/** Retorna todos os modelos de uma marca */
export function getModelsByBrand(brand: string): VehicleModel[] {
  const b = vehicleBrands.find(
    (item) => item.brand.toLowerCase() === brand.toLowerCase()
  );
  return b?.models ?? [];
}
