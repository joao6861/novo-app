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
  // ... (resto das interfaces que te mandei)
}
