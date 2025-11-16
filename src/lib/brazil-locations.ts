// Lista de estados do Brasil (apenas siglas)
export const brazilStates = [
  "AC", "AL", "AP", "AM", "BA",
  "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB",
  "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP",
  "SE", "TO",
];

// Mapa de cidades por estado (por enquanto, amostra leve e funcional)
export const citiesByState: Record<string, string[]> = {
  AC: ["Rio Branco"],
  AL: ["Maceió"],
  AP: ["Macapá"],
  AM: ["Manaus"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte"],
  DF: ["Brasília"],
  ES: ["Vitória", "Vila Velha", "Serra"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis"],
  MA: ["São Luís"],
  MT: ["Cuiabá"],
  MS: ["Campo Grande"],
  MG: ["Belo Horizonte", "Contagem", "Uberlândia", "Juiz de Fora"],
  PA: ["Belém", "Ananindeua"],
  PB: ["João Pessoa", "Campina Grande"],
  PR: ["Curitiba", "Ponta Grossa", "Maringá", "Londrina", "Cascavel"],
  PE: ["Recife", "Olinda", "Caruaru"],
  PI: ["Teresina"],
  RJ: ["Rio de Janeiro", "Niterói", "Duque de Caxias", "Nova Iguaçu"],
  RN: ["Natal", "Mossoró"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas"],
  RO: ["Porto Velho"],
  RR: ["Boa Vista"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "Itajaí"],
  SP: ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "São José dos Campos"],
  SE: ["Aracaju"],
  TO: ["Palmas"],
};

// Função usada pelo seu page.tsx
export function getCitiesByState(uf: string): string[] {
  return citiesByState[uf] ?? [];
}
