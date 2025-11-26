"use client";

import React, { useState, useRef } from "react";

import {
  getMarcas,
  getModelosByMarca,
  buscarVeiculosPorMarcaModelo,
} from "@/lib/vehicle-data";

type PlacaInfo = {
  placa: string;
  marca: string | null;
  modelo: string | null;
  versao: string | null;
  ano: string | null;
  ano_modelo: string | null;
  cor: string | null;
  combustivel: string | null;
  potencia: string | null;
  cilindradas: string | null;
  passageiros: string | null;
  tipo_veiculo: string | null;
  segmento: string | null;
  uf: string | null;
  municipio: string | null;
  chassi: string | null;
};

type MaintenanceRow = {
  col1: string; // item
  col2: string; // especificação / código
  searchTerm: string;
};

type MaintenanceModule = {
  title: string;
  rows: MaintenanceRow[];
};

function tokenize(str: string | null | undefined): string[] {
  if (!str) return [];
  return str
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function canonicalizarMarcaPlaca(marcaPlaca: string): string {
  let up = marcaPlaca.toUpperCase().trim();

  if (up.includes("/")) {
    const partes = up.split("/").map((p) => p.trim());
    if (partes.includes("ABARTH")) return "ABARTH";
    if (partes.includes("CHEVROLET")) return "CHEVROLET";
    up = partes[0];
  }

  if (up === "VW" || up.includes("VOLKS")) return "VOLKSWAGEN";
  if (up === "GM" || up.includes("CHEV")) return "CHEVROLET";
  if (up.includes("MERCEDES-BENZ") || up.includes("MERCEDES")) {
    return "MERCEDES BENZ";
  }
  if (up.includes("FIAT")) return "FIAT";
  if (up.includes("ABARTH")) return "ABARTH";
  if (up.includes("BMW") && up.includes("MOTO")) return "BMW MOTOS";
  if (up.includes("HARLEY")) return "HARLEY DAVIDSON MOTOS";
  if (up.includes("YAMAHA") && up.includes("MOTO")) return "YAMAHA MOTOS";
  if (up.includes("HONDA") && up.includes("MOTO")) return "HONDA MOTOS";

  return up;
}

function calcularScoreMatch(info: PlacaInfo, v: any): number {
  let score = 0;

  const placaTokens = tokenize(`${info.modelo || ""} ${info.versao || ""}`);
  const veicTokens = tokenize(v.veiculo_raw || "");
  const placaSet = new Set(placaTokens);
  const veicSet = new Set(veicTokens);

  let comuns = 0;
  placaSet.forEach((t) => {
    if (veicSet.has(t)) comuns++;
  });

  const importantTokens = placaTokens.filter(
    (t) =>
      !/^\d+$/.test(t) &&
      t.length > 2 &&
      !["FLEX", "GASOLINA", "ETANOL", "ALCOOL", "ÁLCOOL", "DIESEL"].includes(t)
  );

  let comunsImportantes = 0;
  importantTokens.forEach((t) => {
    if (veicSet.has(t)) comunsImportantes++;
  });

  if (comuns === 0) {
    score -= 10;
  } else {
    score += comuns * 4;
    score += comunsImportantes * 3;
  }

  const anoStr = info.ano_modelo || info.ano;
  const ano = anoStr ? parseInt(anoStr, 10) : NaN;
  const anoDe = v.ano_de as number | undefined;
  const anoAte = v.ano_ate as number | undefined;

  if (!isNaN(ano)) {
    if (anoDe && anoAte) {
      if (ano >= anoDe && ano <= anoAte) {
        score += 10;
      } else {
        const dist = ano < anoDe ? anoDe - ano : ano - anoAte;
        score -= Math.min(10, dist * 2);
      }
    } else if (anoDe && !anoAte) {
      if (ano >= anoDe) {
        score += 8;
      } else {
        score -= Math.min(8, (anoDe - ano) * 2);
      }
    }
  }

  if (info.combustivel && v.combustivel) {
    const normalizeFuel = (s: string) => {
      const upFuel = s.toUpperCase();
      if (upFuel.includes("DIE")) return "DIESEL";
      if (upFuel.includes("ALC") || upFuel.includes("ETAN")) return "ALCOOL";
      if (upFuel.includes("FLEX")) return "FLEX";
      if (upFuel.includes("GAS")) return "GASOLINA";
      return upFuel;
    };

    const fi = normalizeFuel(info.combustivel);
    const fv = normalizeFuel(String(v.combustivel));

    if (fi === fv) {
      score += 6;
    } else if (
      (fi === "FLEX" && (fv === "GASOLINA" || fv === "ALCOOL")) ||
      (fv === "FLEX" && (fi === "GASOLINA" || fi === "ALCOOL"))
    ) {
      score += 3;
    } else {
      score -= 2;
    }
  }

  if (info.potencia && v.potencia_cv != null) {
    const pi = parseInt(info.potencia.replace(/\D+/g, ""), 10);
    const pvRaw = v.potencia_cv;
    const pv =
      typeof pvRaw === "number"
        ? pvRaw
        : parseInt(String(pvRaw).replace(/\D+/g, ""), 10);

    if (!isNaN(pi) && !isNaN(pv)) {
      const diff = Math.abs(pi - pv);
      if (diff <= 5) score += 6;
      else if (diff <= 15) score += 3;
      else if (diff <= 30) score += 1;
      else score -= 2;
    }
  }

  return score;
}

function buscarVeiculosPorPlacaNaBase(info: PlacaInfo): any[] {
  if (!info.marca || !info.modelo) return [];

  const marcaCanon = canonicalizarMarcaPlaca(info.marca);

  const modeloUp = (info.modelo || "").toUpperCase();
  const versaoUp = (info.versao || "").toUpperCase();
  const tokens = modeloUp.split(/\s+/).filter(Boolean);

  const mainToken =
    tokens.find(
      (t) =>
        !/\d/.test(t) &&
        t.length > 2 &&
        !["FLEX", "GASOLINA", "ETANOL", "ALCOOL", "ÁLCOOL", "DIESEL"].includes(
          t
        )
    ) || tokens[0];

  const searchTerms: string[] = [];

  const fullWithVersion = `${modeloUp} ${versaoUp}`.trim();
  if (fullWithVersion) searchTerms.push(fullWithVersion);
  if (modeloUp && !searchTerms.includes(modeloUp)) searchTerms.push(modeloUp);
  if (mainToken && !searchTerms.includes(mainToken)) searchTerms.push(mainToken);

  const cleanTokens = tokens.filter(
    (t) =>
      !/\d/.test(t) &&
      t.length > 2 &&
      !["FLEX", "GASOLINA", "ETANOL", "ALCOOL", "ÁLCOOL", "DIESEL"].includes(t)
  );
  for (const t of cleanTokens) {
    if (!searchTerms.includes(t)) searchTerms.push(t);
  }

  let candidatos: any[] = [];

  for (const term of searchTerms) {
    const r = buscarVeiculosPorMarcaModelo(marcaCanon, term);
    if (r && r.length > 0) {
      candidatos = candidatos.concat(r);
    }
  }

  if (candidatos.length === 0) return [];

  const seen = new Set<string>();
  candidatos = candidatos.filter((v) => {
    const key = `${v.marca}::${v.veiculo_raw}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const scored = candidatos.map((v) => ({
    v,
    score: calcularScoreMatch(info, v),
  }));

  const maxScore = scored.reduce(
    (max, cur) => (cur.score > max ? cur.score : max),
    -Infinity
  );
  if (maxScore <= 0) return [];

  const limite = Math.max(12, maxScore * 0.65);
  const filtrados = scored
    .filter((s) => s.score >= limite)
    .sort((a, b) => b.score - a.score);

  const principais = filtrados.slice(0, 3);

  if (principais.length === 3) {
    const s0 = principais[0].score;
    const s2 = principais[2].score;
    if (s0 - s2 > 6) {
      return principais.slice(0, 2).map((x) => x.v);
    }
  }

  if (principais.length >= 2) {
    const s0 = principais[0].score;
    const s1 = principais[1].score;
    if (s0 - s1 > 8) {
      return [principais[0].v];
    }
  }

  return principais.map((x) => x.v);
}

function montarDetalhesVeiculo(r: any): string {
  const extra = r.extra || {};
  const mm = r.marca_modelo || extra.marca_modelo || {};

  const marca = r.marca || r.MARCA || mm.marca;
  const modelo = r.modelo || r.MODELO || mm.modelo;
  const versao = r.VERSAO || mm.versao;
  const anoFab = extra.ano_fabricacao || r.ano;
  const anoMod = extra.ano_modelo || r.ano_modelo || r.anoModelo;
  const placa = r.placa_modelo_novo || r.placa || extra.placa;
  const chassi = extra.chassi || r.chassi;
  const tipoVeiculo = r.tipo_veiculo?.tipo_veiculo;
  const segmento = mm.segmento;
  const cor =
    r.cor_veiculo?.cor ||
    extra.cor_veiculo?.cor ||
    r.cor ||
    extra.cor;
  const combustivel = extra.combustivel || r.combustivel;
  const potencia = extra.potencia || r.potencia;
  const cilindradas = extra.cilindradas || r.cilindradas;
  const passageiros =
    extra.quantidade_passageiro || r.quantidade_passageiro;
  const municipio = extra.municipio?.municipio || r.municipio;
  const uf =
    extra.municipio?.uf ||
    r.uf_placa ||
    r.uf ||
    extra.uf_placa ||
    extra.uf;
  const renavam = extra.renavam ?? "Não informado";

  const partes: string[] = [];

  if (marca || modelo) {
    partes.push([marca, modelo, versao].filter(Boolean).join(" "));
  }
  if (tipoVeiculo) partes.push(`Tipo: ${tipoVeiculo}`);
  if (segmento) partes.push(`Segmento: ${segmento}`);

  if (anoFab || anoMod) {
    partes.push(`Ano: ${anoFab || "?"}/${anoMod || "?"}`);
  }

  if (placa) partes.push(`Placa: ${placa}`);
  if (chassi) partes.push(`Chassi: ${chassi}`);

  if (cor) partes.push(`Cor: ${cor}`);
  if (combustivel) partes.push(`Combustível: ${combustivel}`);
  if (potencia) partes.push(`Potência: ${potencia} cv`);
  if (cilindradas) partes.push(`Cilindradas: ${cilindradas} cc`);
  if (passageiros) partes.push(`Passageiros: ${passageiros}`);

  if (municipio || uf) {
    partes.push(`Local: ${municipio || "?"}/${uf || "?"}`);
  }

  partes.push(`Renavam: ${renavam}`);

  return partes.join(" • ");
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #00c2ff 0%, #0077ff 100%)",
    color: "#ffffff",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    boxSizing: "border-box",
  },
  topArea: {
    padding: "24px 16px 0",
  },
  topInner: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  logoBlock: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    height: 40,
    objectFit: "contain",
    display: "block",
  },
  systemButton: {
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.75)",
    padding: "8px 18px",
    fontSize: 11,
    background: "rgba(0,0,0,0.18)",
    cursor: "pointer",
  },
  cardsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginTop: 18,
    marginBottom: 10,
  },
  card: {
    background: "#ffffff",
    color: "#0f172a",
    borderRadius: 10,
    padding: "12px 18px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(15,23,42,0.18)",
    border: "1px solid transparent",
    transition: "all 0.18s ease",
  },
  cardActive: {
    background: "linear-gradient(135deg,#0f172a,#1e293b)",
    color: "#e5f0ff",
    border: "1px solid rgba(96,165,250,0.9)",
  },
  cardIcon: {
    width: 18,
    textAlign: "center",
    opacity: 0.75,
  },
  cardLabel: {
    fontWeight: 500,
  },
  searchWrapper: {
    marginTop: 8,
    marginBottom: 8,
  },
  searchRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 8,
  },
  searchInput: {
    width: "100%",
    borderRadius: 8,
    border: "1px solid #00b7ff",
    background: "#ffffff",
    color: "#000000",
    padding: "10px 16px",
    fontSize: 13,
  },
  searchBtn: {
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.7)",
    padding: "0 22px",
    background: "rgba(0,0,0,0.18)",
    color: "#ffffff",
    fontSize: 13,
    cursor: "pointer",
  },
  searchHint: {
    fontSize: 11,
    opacity: 0.85,
    marginTop: 4,
  },
  manualGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },
  manualField: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  manualLabel: {
    fontSize: 11,
    opacity: 0.9,
  },
  manualSelect: {
    borderRadius: 8,
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    padding: "8px 10px",
    fontSize: 12,
  },
  manualButtonRow: {
    marginTop: 10,
    display: "flex",
    justifyContent: "flex-end",
  },
  resultWrapper: {
    marginTop: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  resultSection: {
    padding: "12px 0 4px",
    borderRadius: 0,
    background: "transparent",
    border: "none",
    fontSize: 12,
    textAlign: "left",
  },
  resultSectionTitle: {
    fontWeight: 600,
    marginBottom: 10,
    fontSize: 13,
  },
  resultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 10,
  },
  resultItem: {
    display: "flex",
    flexDirection: "column",
    background:
      "radial-gradient(circle at top, #0b1120 0%, #020617 60%, #020617 100%)",
    borderRadius: 12,
    padding: "10px 12px",
    border: "1px solid rgba(148,163,184,0.55)",
    boxShadow: "0 10px 25px rgba(15,23,42,0.7)",
  },
  resultItemLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    opacity: 0.7,
    marginBottom: 2,
  },
  resultItemValue: {
    fontSize: 13,
    fontWeight: 600,
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  tag: {
    fontSize: 11,
    padding: "4px 9px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.7)",
    background: "rgba(15,23,42,0.96)",
  },
  heroOuter: {
    background:
      "radial-gradient(circle at top, #1b2440 0%, #020617 40%, #020617 100%)",
    padding: "56px 16px 48px",
    boxShadow: "0 -12px 32px rgba(0,0,0,0.45)",
  },
  heroInner: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    textAlign: "center",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    border: "1px solid rgba(56,189,248,0.7)",
    padding: "7px 20px",
    fontSize: 11,
    marginBottom: 26,
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(8,47,73,0.95))",
  },
  heroBadgeIcon: {
    fontSize: 13,
  },
  heroBadgeText: {
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    opacity: 0.9,
  },
  heroTitleLine1: {
    fontSize: 46,
    fontWeight: 800,
    margin: "0 0 4px 0",
  },
  heroTitleLine2: {
    fontSize: 46,
    fontWeight: 800,
    margin: 0,
    color: "#60a5fa",
  },
  heroText: {
    marginTop: 20,
    marginBottom: 0,
    fontSize: 15,
    opacity: 0.95,
    maxWidth: 780,
    marginLeft: "auto",
    marginRight: "auto",
  },
  whyOuter: {
    backgroundColor: "#020617",
    padding: "56px 16px 64px",
  },
  whyInner: {
    width: "100%",
    maxWidth: 1100,
    margin: "0 auto",
    textAlign: "center",
    color: "#e5e7eb",
  },
  whyTitle: {
    marginTop: 0,
    marginBottom: 8,
    fontSize: 24,
    fontWeight: 700,
  },
  whySub: {
    marginTop: 0,
    marginBottom: 32,
    fontSize: 14,
    color: "#9ca3af",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 24,
  },
  featureCard: {
    background:
      "radial-gradient(circle at top, #111827 0%, #020617 45%, #020617 100%)",
    borderRadius: 24,
    padding: "32px 28px 30px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.65)",
    border: "1px solid rgba(148,163,184,0.12)",
    textAlign: "center",
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 10,
    color: "#f9fafb",
  },
  featureText: {
    fontSize: 14,
    color: "#9ca3af",
    lineHeight: 1.5,
  },
  newsletterOuter: {
    padding: "60px 16px 80px",
    backgroundColor: "#00b7ff",
    backgroundImage: "url('/newsletter-banner.png')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center bottom",
    backgroundSize: "contain",
  },
  newsletterInner: {
    width: "100%",
    maxWidth: 720,
    margin: "0 auto",
    textAlign: "center",
  },
  newsletterTitle: {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 8,
  },
  newsletterText: {
    fontSize: 14,
    marginBottom: 20,
  },
  newsletterForm: {
    display: "flex",
    maxWidth: 520,
    margin: "0 auto",
    marginTop: 4,
  },
  newsletterInput: {
    flex: 1,
    border: "none",
    borderRadius: "4px 0 0 4px",
    padding: "10px 12px",
    fontSize: 14,
    outline: "none",
  },
  newsletterButton: {
    border: "none",
    borderRadius: "0 4px 4px 0",
    padding: "0 18px",
    backgroundColor: "#39ff14",
    color: "#000000",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  footerOuter: {
    backgroundColor: "#000000",
    color: "#ffffff",
    padding: "24px 16px 16px",
  },
  footerInner: {
    width: "100%",
    maxWidth: 1100,
    margin: "0 auto",
  },
  footerBottom: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    paddingTop: 4,
  },
  footerBottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 40,
    flexWrap: "wrap",
  },
  paymentSection: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  paymentTitle: {
    fontSize: 13,
    fontWeight: 500,
  },
  paymentBadges: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  paymentBadge: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 4,
    backgroundColor: "#111827",
    border: "1px solid #1f2937",
  },
  ratingRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
  },
  ratingImage: {
    height: 48,
    objectFit: "contain",
    display: "block",
  },
  footerCopy: {
    textAlign: "center",
    fontSize: 11,
    opacity: 0.8,
    marginTop: 4,
  },

  filterModule: {
    marginTop: 18,
  },
  filterModuleTitleBar: {
    backgroundColor: "#000000",
    padding: "4px 10px",
    borderRadius: "8px 8px 0 0",
    border: "1px solid #111827",
    borderBottom: "none",
    color: "#f9fafb",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 600,
  },
  filterModuleTitleText: {
    textAlign: "center",
  },
  filterTable: {
    borderRadius: "0 0 8px 8px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(15,23,42,0.7)",
    border: "1px solid #111827",
    backgroundColor: "#ffffff",
  },
  filterHeaderRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1.4fr 1fr",
    backgroundColor: "#111827",
    color: "#f9fafb",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 600,
  },
  filterHeaderCell: {
    padding: "6px 12px",
    borderRight: "1px solid #1f2937",
    textAlign: "center",
  },
  filterRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1.4fr 1fr",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e5e7eb",
    fontSize: 12,
  },
  filterCell: {
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    borderRight: "1px solid #e5e7eb",
  },
  filterCellAction: {
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

const TUREGGON_SEARCH_BASE_URL = "https://tureggon.com/search/?q=";

function SearchButton({ term }: { term: string }) {
  if (!term) return null;
  const url = `${TUREGGON_SEARCH_BASE_URL}${encodeURIComponent(term)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontSize: 11,
        padding: "6px 12px",
        borderRadius: 999,
        border: "1px solid #00b8ff",
        backgroundColor: "transparent",
        color: "#0284c7",
        cursor: "pointer",
        textDecoration: "none",
        whiteSpace: "nowrap",
        fontWeight: 600,
      }}
    >
      Buscar na Tureggon
    </a>
  );
}

export default function Home() {
  const [mode, setMode] = useState<"plate" | "manual">("plate");
  const plateInputRef = useRef<HTMLInputElement | null>(null);
  const brandSelectRef = useRef<HTMLSelectElement | null>(null);
  const searchBlockRef = useRef<HTMLDivElement | null>(null);

  const [brand, setBrand] = useState("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [manualResults, setManualResults] = useState<any[]>([]);
  const [plateVehicleMatches, setPlateVehicleMatches] = useState<any[]>([]);

  const [plate, setPlate] = useState("");
  const [plateLoading, setPlateLoading] = useState(false);
  const [plateError, setPlateError] = useState<string | null>(null);
  const [plateResult, setPlateResult] = useState<PlacaInfo | null>(null);
  const [rawApiData, setRawApiData] = useState<any | null>(null);

  const resp = rawApiData?.response || {};
  const extra = resp.extra || {};
  const restricoes =
    [
      extra.restricao1?.restricao,
      extra.restricao2?.restricao,
      extra.restricao3?.restricao,
      extra.restricao4?.restricao,
    ]
      .filter((r: string | undefined | null) => r && r.trim() !== "")
      .join(" · ") || "Sem restrições registradas";

  const fipeStatus =
    resp.fipe?.dados && resp.fipe.dados.length > 0
      ? "Dados FIPE disponíveis"
      : "Sem dados FIPE retornados nesta consulta";

  const multasStatus =
    resp.multas?.dados && resp.multas.dados.length > 0
      ? `${resp.multas.dados.length} multa(s) encontrada(s)`
      : "Nenhuma multa encontrada na consulta";

  const detalhesVeiculo =
    rawApiData?.response ? montarDetalhesVeiculo(rawApiData.response) : "";

  const principalVeiculo = plateVehicleMatches[0] || null;

  // ---- NOVO: construção dos módulos de manutenção (tudo que vier do banco) ----
  const maintenanceModules: MaintenanceModule[] = [];

  if (principalVeiculo) {
    const v: any = principalVeiculo;

    const ensureModule = (title: string): MaintenanceModule => {
      let m = maintenanceModules.find((mm) => mm.title === title);
      if (!m) {
        m = { title, rows: [] };
        maintenanceModules.push(m);
      }
      return m;
    };

    const addRow = (
      title: string,
      label: string,
      value: unknown,
      searchTerm?: string
    ) => {
      if (value === null || value === undefined) return;
      const valStr = String(value).trim();
      if (!valStr) return;
      const mod = ensureModule(title);
      mod.rows.push({
        col1: label,
        col2: valStr,
        searchTerm: searchTerm || valStr,
      });
    };

    const niceLabelFromKey = (key: string) => {
      return key
        .replace(/^filtros?_?/i, "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    // 1) Campos conhecidos (monta descrições mais bonitas)
    if (
      v.oleo_motor_litros ||
      v.oleo_motor_viscosidade ||
      v.oleo_motor_especificacao
    ) {
      const parts: string[] = [];
      if (v.oleo_motor_litros) parts.push(`${v.oleo_motor_litros} L`);
      if (v.oleo_motor_viscosidade) parts.push(String(v.oleo_motor_viscosidade));
      if (v.oleo_motor_especificacao)
        parts.push(String(v.oleo_motor_especificacao));
      addRow("Óleos e fluidos", "Óleo do motor", parts.join(" · "));
    }

    if (
      v.oleo_cambio_manual_litros ||
      v.oleo_cambio_manual_viscosidade ||
      v.oleo_cambio_manual_especificacao
    ) {
      const parts: string[] = [];
      if (v.oleo_cambio_manual_litros)
        parts.push(`${v.oleo_cambio_manual_litros} L`);
      if (v.oleo_cambio_manual_viscosidade)
        parts.push(String(v.oleo_cambio_manual_viscosidade));
      if (v.oleo_cambio_manual_especificacao)
        parts.push(String(v.oleo_cambio_manual_especificacao));
      addRow("Óleos e fluidos", "Óleo do câmbio manual", parts.join(" · "));
    }

    if (
      v.oleo_cambio_auto_total_litros ||
      v.oleo_cambio_auto_parcial_litros ||
      v.oleo_cambio_auto_especificacao
    ) {
      const parts: string[] = [];
      if (v.oleo_cambio_auto_total_litros)
        parts.push(`Total: ${v.oleo_cambio_auto_total_litros} L`);
      if (v.oleo_cambio_auto_parcial_litros)
        parts.push(`Parcial: ${v.oleo_cambio_auto_parcial_litros} L`);
      if (v.oleo_cambio_auto_especificacao)
        parts.push(String(v.oleo_cambio_auto_especificacao));
      addRow("Óleos e fluidos", "Óleo do câmbio automático", parts.join(" · "));
    }

    if (v.aditivo_radiador_litros || v.aditivo_radiador_tipo) {
      const parts: string[] = [];
      if (v.aditivo_radiador_litros)
        parts.push(`${v.aditivo_radiador_litros} L`);
      if (v.aditivo_radiador_tipo) parts.push(String(v.aditivo_radiador_tipo));
      if (v.aditivo_radiador_cor) parts.push(String(v.aditivo_radiador_cor));
      addRow("Óleos e fluidos", "Líquido de arrefecimento", parts.join(" · "));
    }

    if (v.fluido_freio_litros || v.fluido_freio_tipo) {
      const parts: string[] = [];
      if (v.fluido_freio_litros) parts.push(`${v.fluido_freio_litros} L`);
      if (v.fluido_freio_tipo) parts.push(String(v.fluido_freio_tipo));
      addRow("Óleos e fluidos", "Fluido de freio", parts.join(" · "));
    }

    // Filtros em objeto "filtros" (se existir)
    if (v.filtros && typeof v.filtros === "object") {
      const f = v.filtros;
      const handleFilterArray = (arr: any[], labelPrefix: string) => {
        arr.forEach((item: any) => {
          if (!item) return;
          const brand = String(item.marca || "—");
          const code = String(item.codigo || "—");
          const desc = `${brand} · ${code}`;
          addRow("Filtros", `${labelPrefix}`, desc, code);
        });
      };

      if (Array.isArray(f.oleo)) handleFilterArray(f.oleo, "Filtro de óleo");
      if (Array.isArray(f.ar)) handleFilterArray(f.ar, "Filtro de ar");
      if (Array.isArray(f.cabine))
        handleFilterArray(f.cabine, "Filtro de cabine");
      if (Array.isArray(f.combustivel))
        handleFilterArray(f.combustivel, "Filtro de combustível");
      if (Array.isArray(f.cambio_auto))
        handleFilterArray(f.cambio_auto, "Filtro de câmbio automático");
    }

    // 2) Varredura genérica de TODOS os campos do veículo
    Object.entries(v).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (typeof value === "object") return; // objetos tratamos separadamente
      const valStr = String(value).trim();
      if (!valStr) return;

      const k = key.toLowerCase();

      let title: string | null = null;

      if (
        k.includes("oleo") ||
        k.includes("óleo") ||
        k.includes("fluido") ||
        k.includes("aditivo") ||
        k.includes("radiador") ||
        k.includes("diferencial") ||
        k.includes("cambio") ||
        k.includes("caixa") ||
        k.includes("direcao")
      ) {
        title = "Óleos e fluidos";
      } else if (k.includes("filtro")) {
        title = "Filtros";
      } else if (k.includes("palheta") || k.includes("limpador")) {
        title = "Palhetas / Limpadores";
      } else if (
        k.includes("lamp") ||
        k.includes("farol") ||
        k.includes("lanterna") ||
        k.includes("seta") ||
        k.includes("pisca")
      ) {
        title = "Lâmpadas / Iluminação";
      } else {
        // Se não bater com nada, joga em "Outros itens de manutenção"
        title = "Outros itens de manutenção";
      }

      const label = niceLabelFromKey(key);
      addRow(title, label, valStr);
    });
  }

  const scrollToSearch = (target: "plate" | "manual") => {
    if (searchBlockRef.current) {
      searchBlockRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setTimeout(() => {
      if (target === "plate") plateInputRef.current?.focus();
      else brandSelectRef.current?.focus();
    }, 300);
  };

  const handleSelectPlate = () => {
    setMode("plate");
    scrollToSearch("plate");
  };

  const handleSelectManual = () => {
    setMode("manual");
    scrollToSearch("manual");
  };

  const handleOfficesClick = () => {
    window.open(
      "https://www.google.com/maps/search/oficina+perto+de+mim",
      "_blank"
    );
  };

  const handleBrandChange = (value: string) => {
    setBrand(value);
    const models = value ? getModelosByMarca(value) : [];
    setAvailableModels(models);
    setSelectedModel("");
    setManualResults([]);
  };

  const renderVeiculoTecnico = (v: any, idx: number) => (
    <div
      key={idx}
      style={{
        marginBottom: 16,
        borderTop: "1px solid rgba(148,163,184,0.4)",
        paddingTop: 10,
      }}
    >
      <div style={styles.resultGrid}>
        <div style={styles.resultItem}>
          <span style={styles.resultItemLabel}>Veículo</span>
          <span style={styles.resultItemValue}>
            {v.marca} {v.veiculo_raw}
          </span>
        </div>
        <div style={styles.resultItem}>
          <span style={styles.resultItemLabel}>Anos</span>
          <span style={styles.resultItemValue}>
            {v.ano_de
              ? v.ano_ate
                ? `${v.ano_de} até ${v.ano_ate}`
                : `A partir de ${v.ano_de}`
              : "—"}
          </span>
        </div>
        <div style={styles.resultItem}>
          <span style={styles.resultItemLabel}>Motor</span>
          <span style={styles.resultItemValue}>
            {[
              v.motor_litros,
              v.motor_valvulas,
              v.potencia_cv ? `${v.potencia_cv} CV` : null,
              v.combustivel,
            ]
              .filter(Boolean)
              .join(" · ") || "—"}
          </span>
        </div>
      </div>
    </div>
  );

  const handleSearchClick = async () => {
    if (mode === "plate") {
      const value = plate.trim().toUpperCase();
      if (!value) {
        setPlateError("Digite a placa para realizar a consulta.");
        setPlateResult(null);
        setRawApiData(null);
        setPlateVehicleMatches([]);
        return;
      }

      setPlateError(null);
      setPlateLoading(true);
      setPlateResult(null);
      setRawApiData(null);
      setPlateVehicleMatches([]);

      try {
        const res = await fetch("/api/consulta-placa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ placa: value }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          const msg =
            (typeof data.message === "string" && data.message) ||
            "Erro ao consultar a placa.";
          setPlateError(msg);
          return;
        }

        setRawApiData(data);

        const r = data.response || {};
        const ex = r.extra || {};
        const mm = r.marca_modelo || ex.marca_modelo || {};

        const resumo: PlacaInfo = {
          placa: r.placa_modelo_novo || r.placa || value,
          marca: r.marca || r.MARCA || mm.marca || null,
          modelo: r.modelo || r.MODELO || mm.modelo || null,
          versao: r.VERSAO || mm.versao || null,
          ano: r.ano || ex.ano_fabricacao || null,
          ano_modelo:
            r.ano_modelo || r.anoModelo || ex.ano_modelo || null,
          cor:
            (r.cor_veiculo && r.cor_veiculo.cor) ||
            (ex.cor_veiculo && ex.cor_veiculo.cor) ||
            r.cor ||
            null,
          combustivel: r.combustivel || ex.combustivel || null,
          potencia: r.potencia || ex.potencia || null,
          cilindradas: r.cilindradas || ex.cilindradas || null,
          passageiros:
            r.quantidade_passageiro || ex.quantidade_passageiro || null,
          tipo_veiculo:
            (r.tipo_veiculo && r.tipo_veiculo.tipo_veiculo) || null,
          segmento: mm.segmento || null,
          uf: r.uf || ex.uf || ex.uf_placa || null,
          municipio:
            r.municipio ||
            (ex.municipio && ex.municipio.municipio) ||
            null,
          chassi: ex.chassi || r.chassi || null,
        };

        setPlateResult(resumo);

        const matches = buscarVeiculosPorPlacaNaBase(resumo);
        setPlateVehicleMatches(matches);
      } catch (e) {
        console.error(e);
        setPlateError("Falha ao consultar a placa.");
      } finally {
        setPlateLoading(false);
      }
    } else {
      if (!brand || !selectedModel) {
        alert("Selecione marca e modelo para realizar a consulta.");
        return;
      }

      const resultados = buscarVeiculosPorMarcaModelo(brand, selectedModel);
      if (!resultados || resultados.length === 0) {
        alert(
          "Nenhum veículo encontrado na base interna para essa marca/modelo."
        );
        setManualResults([]);
        return;
      }
      setManualResults(resultados);
    }
  };

  const brandOptions = getMarcas();

  return (
    <main style={styles.page}>
      <section style={styles.topArea}>
        <div style={styles.topInner}>
          <header style={styles.header}>
            <a
              href="https://tureggon.com/"
              style={styles.logoBlock}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/logo.png"
                alt="Tureggon Store"
                style={styles.logoImage}
              />
            </a>

            <button type="button" style={styles.systemButton}>
              Sistema Online
            </button>
          </header>

          <div style={styles.cardsRow}>
            <button
              type="button"
              style={{
                ...styles.card,
                ...(mode === "plate" ? styles.cardActive : {}),
              }}
              onClick={handleSelectPlate}
            >
              <span style={styles.cardIcon}>🔍</span>
              <span style={styles.cardLabel}>Buscar por Placa</span>
            </button>

            <button
              type="button"
              style={{
                ...styles.card,
                ...(mode === "manual" ? styles.cardActive : {}),
              }}
              onClick={handleSelectManual}
            >
              <span style={styles.cardIcon}>≡</span>
              <span style={styles.cardLabel}>Buscar sem Placa</span>
            </button>

            <button
              type="button"
              style={styles.card}
              onClick={handleOfficesClick}
            >
              <span style={styles.cardIcon}>📍</span>
              <span style={styles.cardLabel}>Oficinas Próximas</span>
            </button>
          </div>

          <div style={styles.searchWrapper} ref={searchBlockRef}>
            {mode === "plate" && (
              <>
                <div style={styles.searchRow}>
                  <input
                    ref={plateInputRef}
                    type="text"
                    placeholder="Digite a placa (ex: ABC1D23)"
                    style={styles.searchInput}
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  />
                  <button
                    type="button"
                    style={styles.searchBtn}
                    onClick={handleSearchClick}
                    disabled={plateLoading}
                  >
                    {plateLoading ? "Buscando..." : "Buscar"}
                  </button>
                </div>
                <div style={styles.searchHint}>
                  Modo selecionado: <strong>Buscar por Placa</strong>.
                </div>

                {plateError && (
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                      color: "#fecaca",
                    }}
                  >
                    {plateError}
                  </div>
                )}

                {plateResult && (
                  <div style={styles.resultWrapper}>
                    <div style={styles.resultSection}>
                      <div style={styles.resultSectionTitle}>
                        Dados gerais do veículo
                      </div>
                      <div style={styles.resultGrid}>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>Placa</span>
                          <span style={styles.resultItemValue}>
                            {plateResult.placa}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>Marca</span>
                          <span style={styles.resultItemValue}>
                            {plateResult.marca || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>Modelo</span>
                          <span style={styles.resultItemValue}>
                            {plateResult.modelo || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>Versão</span>
                          <span style={styles.resultItemValue}>
                            {plateResult.versao || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>Ano Fab.</span>
                          <span style={styles.resultItemValue}>
                            {plateResult.ano || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Ano Modelo
                          </span>
                          <span style={styles.resultItemValue}>
                            {plateResult.ano_modelo || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>Cor</span>
                          <span style={styles.resultItemValue}>
                            {plateResult.cor || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Tipo de veículo
                          </span>
                          <span style={styles.resultItemValue}>
                            {plateResult.tipo_veiculo || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>Chassi</span>
                          <span style={styles.resultItemValue}>
                            {plateResult.chassi || "—"}
                          </span>
                        </div>
                      </div>

                      <div style={styles.tagRow}>
                        {plateResult.segmento && (
                          <span style={styles.tag}>
                            Segmento: {plateResult.segmento}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* NOVO BLOCO: TABELAS EM MÓDULOS */}
                    {principalVeiculo && maintenanceModules.length > 0 && (
                      <div style={styles.resultSection}>
                        <div style={styles.resultSectionTitle}>
                          Informações de manutenção (base interna)
                        </div>

                        {maintenanceModules.map((mod) => (
                          <div key={mod.title} style={styles.filterModule}>
                            <div style={styles.filterModuleTitleBar}>
                              <div style={styles.filterModuleTitleText}>
                                {mod.title}
                              </div>
                            </div>
                            <div style={styles.filterTable}>
                              <div style={styles.filterHeaderRow}>
                                <div style={styles.filterHeaderCell}>
                                  ITEM
                                </div>
                                <div style={styles.filterHeaderCell}>
                                  ESPECIFICAÇÃO / CÓDIGO
                                </div>
                                <div style={styles.filterHeaderCell}>
                                  BUSCAR NA LOJA
                                </div>
                              </div>
                              {mod.rows.map((row, idx) => (
                                <div
                                  key={`${mod.title}-${idx}`}
                                  style={styles.filterRow}
                                >
                                  <div style={styles.filterCell}>
                                    {row.col1}
                                  </div>
                                  <div style={styles.filterCell}>
                                    {row.col2}
                                  </div>
                                  <div style={styles.filterCellAction}>
                                    <SearchButton term={row.searchTerm} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={styles.resultSection}>
                      <div style={styles.resultSectionTitle}>
                        Especificações técnicas
                      </div>
                      <div style={styles.resultGrid}>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Combustível
                          </span>
                          <span style={styles.resultItemValue}>
                            {plateResult.combustivel || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>Potência</span>
                          <span style={styles.resultItemValue}>
                            {plateResult.potencia
                              ? `${plateResult.potencia} cv`
                              : "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Cilindradas
                          </span>
                          <span style={styles.resultItemValue}>
                            {plateResult.cilindradas
                              ? `${plateResult.cilindradas} cc`
                              : "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Passageiros
                          </span>
                          <span style={styles.resultItemValue}>
                            {plateResult.passageiros || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>Eixos</span>
                          <span style={styles.resultItemValue}>
                            {resp.eixos || extra.eixos || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Cap. Carga (kg)
                          </span>
                          <span style={styles.resultItemValue}>
                            {resp.capacidade_carga ||
                              extra.capacidade_carga ||
                              "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Peso bruto (kg)
                          </span>
                          <span style={styles.resultItemValue}>
                            {extra.peso_bruto_total || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Cap. Máx. Tração
                          </span>
                          <span style={styles.resultItemValue}>
                            {extra.cap_maxima_tracao || "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.resultSection}>
                      <div style={styles.resultSectionTitle}>
                        Localização e documentos
                      </div>
                      <div style={styles.resultGrid}>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            UF da placa
                          </span>
                          <span style={styles.resultItemValue}>
                            {plateResult.uf || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Município
                          </span>
                          <span style={styles.resultItemValue}>
                            {plateResult.municipio || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Nacionalidade
                          </span>
                          <span style={styles.resultItemValue}>
                            {resp.nacionalidade?.nacionalidade ||
                              extra.nacionalidade ||
                              "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>Faturado</span>
                          <span style={styles.resultItemValue}>
                            {extra.faturado || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Tipo doc. faturado
                          </span>
                          <span style={styles.resultItemValue}>
                            {extra.tipo_doc_faturado?.tipo_pessoa || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Tipo doc. proprietário
                          </span>
                          <span style={styles.resultItemValue}>
                            {extra.tipo_doc_prop?.tipo_pessoa || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>Renavam</span>
                          <span style={styles.resultItemValue}>
                            {extra.renavam ?? "Não informado"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.resultSection}>
                      <div style={styles.resultSectionTitle}>
                        Situação e restrições
                      </div>
                      <div style={styles.resultGrid}>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Situação veículo
                          </span>
                          <span style={styles.resultItemValue}>
                            {resp.situacao_veiculo || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Situação chassi
                          </span>
                          <span style={styles.resultItemValue}>
                            {resp.situacao_chassi || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Última atualização
                          </span>
                          <span style={styles.resultItemValue}>
                            {resp.ultima_atualizacao || resp.info || "—"}
                          </span>
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Código retorno
                          </span>
                          <span style={styles.resultItemValue}>
                            {resp.codigoRetorno || "—"}
                          </span>
                        </div>
                      </div>

                      <div style={styles.tagRow}>
                        <span style={styles.tag}>{restricoes}</span>
                        <span style={styles.tag}>{fipeStatus}</span>
                        <span style={styles.tag}>{multasStatus}</span>
                      </div>
                    </div>

                    {detalhesVeiculo && (
                      <div style={styles.resultSection}>
                        <div style={styles.resultSectionTitle}>
                          Resumo completo (campo único)
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>Detalhes</span>
                          <span style={styles.resultItemValue}>
                            {detalhesVeiculo}
                          </span>
                        </div>
                      </div>
                    )}

                    {plateVehicleMatches.length > 0 && (
                      <div style={styles.resultSection}>
                        <div style={styles.resultSectionTitle}>
                          Detalhes técnicos da base interna
                        </div>
                        {plateVehicleMatches
                          .slice(0, 3)
                          .map((v, idx) => renderVeiculoTecnico(v, idx))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {mode === "manual" && (
              <>
                <div style={styles.manualGrid}>
                  <div style={styles.manualField}>
                    <label style={styles.manualLabel}>Marca</label>
                    <select
                      ref={brandSelectRef}
                      style={styles.manualSelect}
                      value={brand}
                      onChange={(e) => handleBrandChange(e.target.value)}
                    >
                      <option value="">Selecione</option>
                      {brandOptions.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.manualField}>
                    <label style={styles.manualLabel}>
                      Modelo (texto base de referência)
                    </label>
                    <select
                      style={styles.manualSelect}
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      disabled={!brand || availableModels.length === 0}
                    >
                      <option value="">
                        {brand
                          ? "Selecione o modelo"
                          : "Escolha primeiro a marca"}
                      </option>
                      {availableModels.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={styles.manualButtonRow}>
                  <button
                    type="button"
                    style={styles.searchBtn}
                    onClick={handleSearchClick}
                  >
                    Buscar
                  </button>
                </div>

                <div style={styles.searchHint}>
                  Modo selecionado:{" "}
                  <strong>Buscar sem Placa (consulta por marca e modelo)</strong>
                  .
                </div>

                {manualResults.length > 0 && (
                  <div style={styles.resultWrapper}>
                    <div style={styles.resultSection}>
                      <div style={styles.resultSectionTitle}>
                        Informações técnicas da base interna (
                        {manualResults.length} versão(ões) encontrada(s))
                      </div>

                      {manualResults
                        .slice(0, 5)
                        .map((v, idx) => renderVeiculoTecnico(v, idx))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <section style={styles.heroOuter}>
        <div style={styles.heroInner}>
          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeIcon}>⚡</span>
            <span style={styles.heroBadgeText}>
              Consulta Veicular Inteligente
            </span>
          </div>

          <h1 style={styles.heroTitleLine1}>Descubra Tudo Sobre</h1>
          <h1 style={styles.heroTitleLine2}>Seu Veículo</h1>

          <p style={styles.heroText}>
            Consulta completa de dados veiculares, especificações técnicas e
            informações de manutenção em segundos.
          </p>
        </div>
      </section>

      <section style={styles.whyOuter}>
        <div style={styles.whyInner}>
          <h2 style={styles.whyTitle}>Por que escolher a Tureggon?</h2>
          <p style={styles.whySub}>
            Tecnologia de ponta para consultas veiculares completas e precisas.
          </p>

          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Base Completa</h3>
              <p style={styles.featureText}>
                Milhares de veículos nacionais e importados em nossa base de
                dados atualizada.
              </p>
            </div>

            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Consulta Rápida</h3>
              <p style={styles.featureText}>
                Resultados em segundos. Digite a placa e tenha todas as
                informações na tela.
              </p>
            </div>

            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Dados Seguros</h3>
              <p style={styles.featureText}>
                Informações confiáveis e atualizadas com total segurança e
                privacidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.newsletterOuter}>
        <div style={styles.newsletterInner}>
          <h2 style={styles.newsletterTitle}>Newsletter</h2>
          <p style={styles.newsletterText}>
            Quer receber nossas ofertas? Cadastre-se e comece a recebê-las!
          </p>

          <form
            style={styles.newsletterForm}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="email"
              required
              placeholder="E-mail"
              style={styles.newsletterInput}
            />
            <button type="submit" style={styles.newsletterButton}>
              ENVIAR
            </button>
          </form>
        </div>
      </section>

      <footer style={styles.footerOuter}>
        <div style={styles.footerInner}>
          <div style={styles.footerBottom}>
            <div style={styles.footerBottomRow}>
              <div style={styles.paymentSection}>
                <span style={styles.paymentTitle}>Meios de pagamento</span>
                <div style={styles.paymentBadges}>
                  <span style={styles.paymentBadge}>VISA</span>
                  <span style={styles.paymentBadge}>Mastercard</span>
                  <span style={styles.paymentBadge}>Elo</span>
                  <span style={styles.paymentBadge}>Pix</span>
                </div>
              </div>

              <div style={styles.paymentSection}>
                <span style={styles.paymentTitle}>Meios de envio</span>
                <div style={styles.paymentBadges}>
                  <span style={styles.paymentBadge}>Correios</span>
                  <span style={styles.paymentBadge}>Transportadora</span>
                </div>
              </div>
            </div>

            <div style={styles.ratingRow}>
              <a
                href="https://www.google.com/maps/place/TUREGGON/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/google-rating.png"
                  alt="Avaliação 5 estrelas da Tureggon no Google"
                  style={styles.ratingImage}
                />
              </a>
            </div>

            <div style={styles.footerCopy}>
              © {new Date().getFullYear()} Tureggon. Todos os direitos
              reservados.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
