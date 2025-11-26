"use client";

import React, { useState, useRef } from "react";
import {
  getMarcas,
  getModelosByMarca,
  buscarVeiculosPorMarcaModelo,
} from "@/lib/vehicle-data";

/** Tipo simplificado para os dados principais da placa exibidos na tela */
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

/** Linhas de manutenção que serão renderizadas nas tabelas */
type MaintenanceRow = {
  label: string;
  value: string;
  searchTerm: string;
  extra?: {
    brand?: string;
    code?: string;
    typeOil?: string;
    norma?: string;
    qty?: string;
  };
};

/** Cada módulo de manutenção (Óleo motor, Filtro de óleo, Dif dianteiro etc.) */
type MaintenanceModule = {
  title: string;
  kind: "generic" | "filters" | "diff";
  rows: MaintenanceRow[];
};

/* ------------------------ helpers de texto e matching ----------------------- */

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

/**
 * Corrigido:
 * - Se nenhum veículo tem score > 0, agora retornamos pelo menos o melhor candidato.
 *   Antes voltava lista vazia e parecia que "não tinha nada" na base interna.
 */
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

  const scored = candidatos
    .map((v) => ({
      v,
      score: calcularScoreMatch(info, v),
    }))
    .sort((a, b) => b.score - a.score);

  const maxScore = scored[0]?.score ?? -Infinity;

  // NOVO: se o melhor ainda for <= 0, usa ele assim mesmo,
  // para pelo menos ter um veículo base.
  if (maxScore <= 0) {
    return [scored[0].v];
  }

  const limite = Math.max(12, maxScore * 0.65);
  const filtrados = scored.filter((s) => s.score >= limite);

  const principais = (filtrados.length ? filtrados : scored).slice(0, 3);

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

function niceLabelFromKey(key: string): string {
  return key
    .replace(/^filtros?_?/i, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* --------------------------------- styles ---------------------------------- */

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
    padding: "24px 16px 24px",
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
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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
  subTabsRow: {
    display: "inline-flex",
    gap: 8,
    padding: "6px",
    backgroundColor: "rgba(15,23,42,0.45)",
    borderRadius: 999,
    marginBottom: 10,
    marginTop: 10,
  },
  subTabBtn: {
    borderRadius: 999,
    border: "none",
    padding: "6px 14px",
    fontSize: 11,
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "#cbd5f5",
  },
  subTabBtnActive: {
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontWeight: 600,
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
    marginTop: 6,
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
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginBottom: 40,
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
    fontWeight: 800,
    marginBottom: 14,
    fontSize: 18,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
  },
  resultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
  filterModule: {
    marginTop: 18,
  },
  filterModuleTitleBar: {
    backgroundColor: "#000000",
    padding: "10px 16px",
    borderRadius: "8px 8px 0 0",
    border: "1px solid #111827",
    borderBottom: "none",
    color: "#f9fafb",
    fontSize: 15,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    fontWeight: 800,
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
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontWeight: 700,
  },
  filterHeaderCell: {
    padding: "8px 12px",
    borderRight: "1px solid #1f2937",
    textAlign: "center",
  },
  filterRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1.4fr 1fr",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e5e7eb",
    fontSize: 12,
    color: "#111827",
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

  /* HERO / POR QUE USAR / NEWSLETTER / FOOTER */

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
  },
  whyTitle: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 6,
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
    marginTop: 8,
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
  footerBadgesRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
    alignItems: "center",
    borderBottom: "1px solid rgba(148,163,184,0.35)",
    paddingBottom: 12,
    marginBottom: 12,
  },
  trustBadge: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  trustText: {
    fontSize: 13,
    color: "#e5e7eb",
  },
  trustLogoRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  trustLogo: {
    height: 32,
    objectFit: "contain",
    display: "block",
  },
  footerLinksRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 24,
    flexWrap: "wrap",
    paddingBottom: 8,
  },
  footerColumn: {
    minWidth: 180,
  },
  footerColumnTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 8,
  },
  footerLink: {
    display: "block",
    fontSize: 12,
    color: "#e5e7eb",
    textDecoration: "none",
    marginBottom: 4,
  },
  ratingBox: {
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,0.45)",
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
    maxWidth: 280,
  },
  ratingStars: {
    color: "#fbbf24",
    fontSize: 14,
  },
  ratingScore: {
    fontSize: 18,
    fontWeight: 700,
  },
  ratingText: {
    fontSize: 12,
    color: "#d1d5db",
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
};

const TUREGGON_SEARCH_BASE_URL = "https://tureggon.com/search/?q=";
const OFICINAS_URL =
  "https://tureggon.com/pages/oficinas-parceiras";

/* --------------------------- botao buscar na loja --------------------------- */

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
        border: "1px solid #00b7ff",
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

/* --------------------------------- página ---------------------------------- */

export default function Home() {
  const [mainTab, setMainTab] = useState<"buscar" | "oficina">("buscar");
  const [mode, setMode] = useState<"plate" | "manual">("plate");

  const searchBlockRef = useRef<HTMLDivElement | null>(null);

  const [brand, setBrand] = useState("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [engine, setEngine] = useState("");
  const [manualResults, setManualResults] = useState<any[]>([]);

  const [plate, setPlate] = useState("");
  const [plateLoading, setPlateLoading] = useState(false);
  const [plateError, setPlateError] = useState<string | null>(null);
  const [plateResult, setPlateResult] = useState<PlacaInfo | null>(null);
  const [rawApiData, setRawApiData] = useState<any | null>(null);
  const [plateVehicleMatches, setPlateVehicleMatches] = useState<any[]>([]);

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

  /* ---------------------- montagem de módulos de manutenção ---------------------- */

  const maintenanceModules: MaintenanceModule[] = [];

  if (principalVeiculo) {
    const v: any = principalVeiculo;

    const handledKeys = new Set<string>();
    const aggregatedFluidKeys = [
      "oleo_motor_litros",
      "oleo_motor_viscosidade",
      "oleo_motor_especificacao",
      "oleo_cambio_manual_litros",
      "oleo_cambio_manual_viscosidade",
      "oleo_cambio_manual_especificacao",
      "oleo_cambio_auto_total_litros",
      "oleo_cambio_auto_parcial_litros",
      "oleo_cambio_auto_especificacao",
      "aditivo_radiador_litros",
      "aditivo_radiador_tipo",
      "aditivo_radiador_cor",
      "fluido_freio_litros",
      "fluido_freio_tipo",
      "oleo_dif_dianteiro_litros",
      "oleo_dif_dianteiro_visco",
      "oleo_dif_dianteiro_especificacao",
      "oleo_dif_traseiro_litros",
      "oleo_dif_traseiro_visco",
      "oleo_dif_traseiro_especificacao",
      "oleo_caixa_transfer_litros",
      "oleo_caixa_transfer_visco",
      "oleo_caixa_transfer_especificacao",
    ];
    aggregatedFluidKeys.forEach((k) => handledKeys.add(k));

    const ensureModule = (
      title: string,
      kind: "generic" | "filters" | "diff"
    ): MaintenanceModule => {
      let m = maintenanceModules.find(
        (mm) => mm.title === title && mm.kind === kind
      );
      if (!m) {
        m = { title, kind, rows: [] };
        maintenanceModules.push(m);
      }
      return m;
    };

    const addGenericRow = (
      title: string,
      label: string,
      value: unknown,
      searchTerm?: string
    ) => {
      if (value === null || value === undefined) return;
      const valStr = String(value).trim();
      if (!valStr) return;

      const mod = ensureModule(title, "generic");
      mod.rows.push({
        label,
        value: valStr,
        searchTerm: searchTerm || valStr,
      });
    };

    const addFilterRow = (
      filterTitle: string,
      brandValue: unknown,
      codeValue: unknown
    ) => {
      const brandStr = (brandValue ?? "").toString().trim();
      const codeStr = (codeValue ?? "").toString().trim();
      if (!brandStr && !codeStr) return;

      const mod = ensureModule(filterTitle, "filters");
      mod.rows.push({
        label: brandStr || "—",
        value: codeStr || "—",
        searchTerm: codeStr || brandStr,
        extra: {
          brand: brandStr || "—",
          code: codeStr || "—",
        },
      });
    };

    const addDiffRow = (
      title: string,
      tipo: unknown,
      norma: unknown,
      litros: unknown
    ) => {
      const tipoStr = (tipo ?? "").toString().trim();
      const normaStr = (norma ?? "").toString().trim();
      const litrosStr = (litros ?? "").toString().trim();
      if (!tipoStr && !normaStr && !litrosStr) return;

      const searchTerm = [tipoStr, normaStr].filter(Boolean).join(" ");
      const mod = ensureModule(title, "diff");
      mod.rows.push({
        label: "",
        value: "",
        searchTerm: searchTerm || litrosStr || title,
        extra: {
          typeOil: tipoStr || "—",
          norma: normaStr || "—",
          qty: litrosStr ? `${litrosStr} L` : "—",
        },
      });
    };

    // ÓLEO DO MOTOR
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
      addGenericRow("Óleo do motor", "Óleo do motor", parts.join(" · "));
    }

    // CÂMBIO MANUAL
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
      addGenericRow(
        "Óleo do câmbio manual",
        "Óleo do câmbio manual",
        parts.join(" · ")
      );
    }

    // CÂMBIO AUTOMÁTICO
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
      addGenericRow(
        "Óleo do câmbio automático",
        "Óleo do câmbio automático",
        parts.join(" · ")
      );
    }

    // ARREFECIMENTO
    if (v.aditivo_radiador_litros || v.aditivo_radiador_tipo) {
      const parts: string[] = [];
      if (v.aditivo_radiador_litros)
        parts.push(`${v.aditivo_radiador_litros} L`);
      if (v.aditivo_radiador_tipo) parts.push(String(v.aditivo_radiador_tipo));
      if (v.aditivo_radiador_cor) parts.push(String(v.aditivo_radiador_cor));
      addGenericRow(
        "Líquido de arrefecimento",
        "Líquido de arrefecimento",
        parts.join(" · ")
      );
    }

    // FLUIDO DE FREIO
    if (v.fluido_freio_litros || v.fluido_freio_tipo) {
      const parts: string[] = [];
      if (v.fluido_freio_litros) parts.push(`${v.fluido_freio_litros} L`);
      if (v.fluido_freio_tipo) parts.push(String(v.fluido_freio_tipo));
      addGenericRow(
        "Fluido de freio",
        "Fluido de freio",
        parts.join(" · ")
      );
    }

    // DIFERENCIAIS / CAIXA TRANSFERÊNCIA
    addDiffRow(
      "Óleo diferencial dianteiro",
      v.oleo_dif_dianteiro_visco,
      v.oleo_dif_dianteiro_especificacao,
      v.oleo_dif_dianteiro_litros
    );
    addDiffRow(
      "Óleo diferencial traseiro",
      v.oleo_dif_traseiro_visco,
      v.oleo_dif_traseiro_especificacao,
      v.oleo_dif_traseiro_litros
    );
    addDiffRow(
      "Óleo caixa de transferência",
      v.oleo_caixa_transfer_visco,
      v.oleo_caixa_transfer_especificacao,
      v.oleo_caixa_transfer_litros
    );

    // FILTROS (Wega, Mann, etc)
    if (v.filtros && typeof v.filtros === "object") {
      const f = v.filtros;
      const handleFilterArray = (arr: any[], tituloModulo: string) => {
        arr.forEach((item: any) => {
          if (!item) return;
          addFilterRow(tituloModulo, item.marca, item.codigo);
        });
      };

      if (Array.isArray(f.oleo))
        handleFilterArray(f.oleo, "Filtro de óleo");
      if (Array.isArray(f.ar)) handleFilterArray(f.ar, "Filtro de ar");
      if (Array.isArray(f.cabine))
        handleFilterArray(f.cabine, "Filtro de cabine");
      if (Array.isArray(f.combustivel))
        handleFilterArray(f.combustivel, "Filtro de combustível");
      if (Array.isArray(f.cambio_auto))
        handleFilterArray(
          f.cambio_auto,
          "Filtro de câmbio automático"
        );
    }

    // DEMAIS CAMPOS DE MANUTENÇÃO
    Object.entries(v).forEach(([key, value]) => {
      if (handledKeys.has(key)) return;
      if (value === null || value === undefined) return;
      if (typeof value === "object") return;
      const valStr = String(value).trim();
      if (!valStr) return;

      const k = key.toLowerCase();

      let title: string;

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
        title = "Óleos e fluidos (outros)";
      } else if (k.includes("palheta") || k.includes("limpador")) {
        title = "Palhetas / limpadores";
      } else if (
        k.includes("lamp") ||
        k.includes("farol") ||
        k.includes("lanterna") ||
        k.includes("seta") ||
        k.includes("pisca")
      ) {
        title = "Lâmpadas / iluminação";
      } else if (k.includes("bateria")) {
        title = "Bateria";
      } else if (k.includes("nivel_cambio") || k.includes("nível_cambio")) {
        title = "Aferição nível do câmbio";
      } else {
        title = "Outros itens de manutenção";
      }

      const label = niceLabelFromKey(key);
      addGenericRow(title, label, valStr);
    });
  }

  /* ----------------------------- handlers / ações ---------------------------- */

  const scrollToSearch = () => {
    if (searchBlockRef.current) {
      searchBlockRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleBrandChange = (value: string) => {
    setBrand(value);
    const models = value ? getModelosByMarca(value) : [];
    setAvailableModels(models);
    setSelectedModel("");
    setManualResults([]);
  };

  const handleAgendarOficina = () => {
    window.open(OFICINAS_URL, "_blank");
  };

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

      let resultados =
        buscarVeiculosPorMarcaModelo(brand, selectedModel) || [];

      const fromNum = yearFrom ? parseInt(yearFrom, 10) : NaN;
      const toNum = yearTo ? parseInt(yearTo, 10) : NaN;

      if (!isNaN(fromNum)) {
        resultados = resultados.filter((v: any) => {
          const anoDe =
            typeof v.ano_de === "number" ? v.ano_de : parseInt(v.ano_de, 10);
          const anoAte =
            typeof v.ano_ate === "number"
              ? v.ano_ate
              : parseInt(v.ano_ate, 10) || anoDe;
          if (isNaN(anoDe) && isNaN(anoAte)) return true;
          return (anoAte || anoDe) >= fromNum;
        });
      }

      if (!isNaN(toNum)) {
        resultados = resultados.filter((v: any) => {
          const anoDe =
            typeof v.ano_de === "number" ? v.ano_de : parseInt(v.ano_de, 10);
          const anoAte =
            typeof v.ano_ate === "number"
              ? v.ano_ate
              : parseInt(v.ano_ate, 10) || anoDe;
          if (isNaN(anoDe) && isNaN(anoAte)) return true;
          return (anoDe || anoAte) <= toNum;
        });
      }

      if (engine.trim()) {
        const eng = engine.replace(/\s+/g, "").toUpperCase();
        resultados = resultados.filter((v: any) => {
          const motorLitros = v.motor_litros
            ? String(v.motor_litros).toUpperCase()
            : "";
          const veic = v.veiculo_raw ? String(v.veiculo_raw).toUpperCase() : "";
          return motorLitros.includes(eng) || veic.includes(eng);
        });
      }

      if (!resultados || resultados.length === 0) {
        alert("Nenhum veículo encontrado com esses filtros.");
        setManualResults([]);
        return;
      }

      setManualResults(resultados);
    }
  };

  const brandOptions = getMarcas();

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

  /* ----------------------------------- JSX ---------------------------------- */

  return (
    <main style={styles.page}>
      {/* TOPO / MENU / BUSCA */}
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

          {/* BOTÕES PRINCIPAIS */}
          <div style={styles.cardsRow}>
            <button
              type="button"
              style={{
                ...styles.card,
                ...(mainTab === "buscar" ? styles.cardActive : {}),
              }}
              onClick={() => {
                setMainTab("buscar");
                setMode("plate");
                scrollToSearch();
              }}
            >
              <span style={styles.cardIcon}>🚗</span>
              <span style={styles.cardLabel}>Buscar veículo</span>
            </button>

            <button
              type="button"
              style={styles.card}
              onClick={handleAgendarOficina}
            >
              <span style={styles.cardIcon}>🛠️</span>
              <span style={styles.cardLabel}>
                Agendar serviço em uma oficina parceira
              </span>
            </button>
          </div>

          {/* BLOCO DE BUSCA */}
          <div style={styles.searchWrapper} ref={searchBlockRef}>
            {mainTab === "buscar" ? (
              <>
                {/* SUB-ABAS */}
                <div style={styles.subTabsRow}>
                  <button
                    type="button"
                    style={{
                      ...styles.subTabBtn,
                      ...(mode === "plate" ? styles.subTabBtnActive : {}),
                    }}
                    onClick={() => {
                      setMode("plate");
                      setPlateError(null);
                    }}
                  >
                    Buscar pela placa
                  </button>
                  <button
                    type="button"
                    style={{
                      ...styles.subTabBtn,
                      ...(mode === "manual" ? styles.subTabBtnActive : {}),
                    }}
                    onClick={() => setMode("manual")}
                  >
                    Buscar por marca, modelo, ano e motor
                  </button>
                </div>

                {/* BUSCA POR PLACA */}
                {mode === "plate" && (
                  <>
                    <div style={styles.searchRow}>
                      <input
                        type="text"
                        placeholder="Digite a placa (ex: ABC1D23)"
                        style={styles.searchInput}
                        value={plate}
                        onChange={(e) =>
                          setPlate(e.target.value.toUpperCase())
                        }
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
                      Opção atual:{" "}
                      <strong>buscar veículo usando apenas a placa</strong>.
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
                  </>
                )}

                {/* BUSCA MANUAL */}
                {mode === "manual" && (
                  <>
                    <div style={styles.manualGrid}>
                      <div style={styles.manualField}>
                        <label style={styles.manualLabel}>Marca</label>
                        <select
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

                    <div style={styles.manualGrid}>
                      <div style={styles.manualField}>
                        <label style={styles.manualLabel}>Ano de</label>
                        <input
                          type="number"
                          placeholder="Ex: 2012"
                          style={styles.searchInput}
                          value={yearFrom}
                          onChange={(e) => setYearFrom(e.target.value)}
                        />
                      </div>
                      <div style={styles.manualField}>
                        <label style={styles.manualLabel}>Ano até</label>
                        <input
                          type="number"
                          placeholder="Ex: 2018"
                          style={styles.searchInput}
                          value={yearTo}
                          onChange={(e) => setYearTo(e.target.value)}
                        />
                      </div>
                      <div style={styles.manualField}>
                        <label style={styles.manualLabel}>
                          Motor (ex: 1.0, 1.8)
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: 1.8"
                          style={styles.searchInput}
                          value={engine}
                          onChange={(e) => setEngine(e.target.value)}
                        />
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
                      Opção atual:{" "}
                      <strong>
                        buscar veículo por marca, modelo, faixa de ano e motor
                      </strong>
                      .
                    </div>
                  </>
                )}

                {/* RESULTADOS BUSCA POR PLACA */}
                {mode === "plate" && plateResult && (
                  <div style={styles.resultWrapper}>
                    {/* DADOS GERAIS */}
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
                        {plateResult.municipio && (
                          <span style={styles.tag}>
                            Local: {plateResult.municipio}
                            {plateResult.uf ? `/${plateResult.uf}` : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* MANUTENÇÃO (BASE INTERNA EM MÓDULOS) */}
                    {principalVeiculo && (
                      <div style={styles.resultSection}>
                        <div style={styles.resultSectionTitle}>
                          Informações de manutenção (base interna)
                        </div>

                        {maintenanceModules.length === 0 ? (
                          <p style={{ fontSize: 13, marginTop: 4 }}>
                            Ainda não temos informações internas de
                            manutenção para esse veículo.
                          </p>
                        ) : (
                          maintenanceModules.map((mod) => (
                            <div
                              key={`${mod.kind}-${mod.title}`}
                              style={styles.filterModule}
                            >
                              <div style={styles.filterModuleTitleBar}>
                                <div style={styles.filterModuleTitleText}>
                                  {mod.title.toUpperCase()}
                                </div>
                              </div>
                              <div style={styles.filterTable}>
                                {/* Cabeçalho */}
                                {mod.kind === "filters" && (
                                  <div style={styles.filterHeaderRow}>
                                    <div style={styles.filterHeaderCell}>
                                      MARCA
                                    </div>
                                    <div style={styles.filterHeaderCell}>
                                      CÓDIGO
                                    </div>
                                    <div style={styles.filterHeaderCell}>
                                      BUSCAR NA LOJA
                                    </div>
                                  </div>
                                )}

                                {mod.kind === "generic" && (
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
                                )}

                                {mod.kind === "diff" && (
                                  <div
                                    style={{
                                      ...styles.filterHeaderRow,
                                      gridTemplateColumns:
                                        "1.4fr 1.2fr 0.8fr 1fr",
                                    }}
                                  >
                                    <div style={styles.filterHeaderCell}>
                                      TIPO DO ÓLEO
                                    </div>
                                    <div style={styles.filterHeaderCell}>
                                      NORMA
                                    </div>
                                    <div style={styles.filterHeaderCell}>
                                      QUANTIDADE
                                    </div>
                                    <div style={styles.filterHeaderCell}>
                                      BUSCAR NA LOJA
                                    </div>
                                  </div>
                                )}

                                {/* Linhas */}
                                {mod.rows.map((row, idx) => {
                                  if (mod.kind === "diff") {
                                    return (
                                      <div
                                        key={`${mod.title}-${idx}`}
                                        style={{
                                          ...styles.filterRow,
                                          gridTemplateColumns:
                                            "1.4fr 1.2fr 0.8fr 1fr",
                                        }}
                                      >
                                        <div style={styles.filterCell}>
                                          {row.extra?.typeOil || "—"}
                                        </div>
                                        <div style={styles.filterCell}>
                                          {row.extra?.norma || "—"}
                                        </div>
                                        <div style={styles.filterCell}>
                                          {row.extra?.qty || "—"}
                                        </div>
                                        <div style={styles.filterCellAction}>
                                          <SearchButton
                                            term={row.searchTerm}
                                          />
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div
                                      key={`${mod.title}-${idx}`}
                                      style={styles.filterRow}
                                    >
                                      <div style={styles.filterCell}>
                                        {mod.kind === "filters"
                                          ? row.extra?.brand || row.label
                                          : row.label}
                                      </div>
                                      <div style={styles.filterCell}>
                                        {mod.kind === "filters"
                                          ? row.extra?.code || row.value
                                          : row.value}
                                      </div>
                                      <div style={styles.filterCellAction}>
                                        <SearchButton term={row.searchTerm} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* RESUMO DA CONSULTA */}
                    {detalhesVeiculo && (
                      <div style={styles.resultSection}>
                        <div style={styles.resultSectionTitle}>
                          Resumo da consulta
                        </div>
                        <div style={styles.resultItem}>
                          <span style={styles.resultItemLabel}>
                            Detalhes FIPE / cadastro
                          </span>
                          <span style={styles.resultItemValue}>
                            {detalhesVeiculo}
                          </span>
                        </div>
                        <div style={styles.tagRow}>
                          <span style={styles.tag}>{restricoes}</span>
                          <span style={styles.tag}>{fipeStatus}</span>
                          <span style={styles.tag}>{multasStatus}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* RESULTADOS BUSCA MANUAL */}
                {mode === "manual" && manualResults.length > 0 && (
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
            ) : (
              // ABA DE OFICINAS PARCEIRAS
              <div
                style={{
                  marginTop: 16,
                  padding: "16px 18px",
                  borderRadius: 12,
                  background:
                    "radial-gradient(circle at top, #0b1120 0%, #020617 60%, #020617 100%)",
                  border: "1px solid rgba(148,163,184,0.55)",
                  fontSize: 13,
                }}
              >
                <p style={{ marginBottom: 12 }}>
                  Para agendar um serviço em uma{" "}
                  <strong>oficina parceira Tureggon</strong>, clique no botão
                  abaixo. Você pode alterar o link direto no código, na
                  constante <code>OFICINAS_URL</code>.
                </p>
                <button
                  type="button"
                  onClick={handleAgendarOficina}
                  style={{
                    marginTop: 4,
                    borderRadius: 999,
                    border: "1px solid #22c55e",
                    padding: "8px 22px",
                    background:
                      "linear-gradient(135deg, #22c55e, #16a34a)",
                    color: "#022c22",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Abrir página de agendamento
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HERO + POR QUE USAR */}
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
          <h2 style={styles.whyTitle}>Por que usar o sistema da Tureggon?</h2>
          <p style={styles.whySub}>
            Tenha em um só lugar dados de placa, especificações técnicas e
            informações de manutenção — tudo integrado com a sua loja.
          </p>

          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Integração com a Loja</h3>
              <p style={styles.featureText}>
                Encontre o produto certo e vá direto para a busca da Tureggon
                com um clique.
              </p>
            </div>

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
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={styles.newsletterOuter}>
        <div style={styles.newsletterInner}>
          <h2 style={styles.newsletterTitle}>Newsletter</h2>
          <p style={styles.newsletterText}>
            Receba novidades, ofertas e conteúdos exclusivos da Tureggon
            diretamente no seu e-mail.
          </p>
          <form
            style={styles.newsletterForm}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="email"
              placeholder="Digite seu e-mail"
              style={styles.newsletterInput}
            />
            <button type="submit" style={styles.newsletterButton}>
              Quero receber
            </button>
          </form>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer style={styles.footerOuter}>
        <div style={styles.footerInner}>
          <div style={styles.footerBottom}>
            <div style={styles.footerBadgesRow}>
              <div style={styles.trustBadge}>
                <span style={styles.ratingStars}>★★★★★</span>
                <div>
                  <div style={styles.ratingScore}>4,9/5,0</div>
                  <div style={styles.ratingText}>
                    Avaliação média dos clientes
                  </div>
                </div>
              </div>

              <div style={styles.trustLogoRow}>
                <img
                  src="/rating-google.png"
                  alt="Avaliações Google"
                  style={styles.ratingImage}
                />
              </div>
            </div>

            <div style={styles.footerLinksRow}>
              <div style={styles.footerColumn}>
                <div style={styles.footerColumnTitle}>Institucional</div>
                <a href="https://tureggon.com/" style={styles.footerLink}>
                  Sobre a Tureggon
                </a>
                <a
                  href="https://tureggon.com/pages/politica-de-privacidade"
                  style={styles.footerLink}
                >
                  Política de privacidade
                </a>
              </div>

              <div style={styles.footerColumn}>
                <div style={styles.footerColumnTitle}>Atendimento</div>
                <a
                  href="https://tureggon.com/pages/contato"
                  style={styles.footerLink}
                >
                  Fale conosco
                </a>
                <a
                  href="https://tureggon.com/pages/duvidas-frequentes"
                  style={styles.footerLink}
                >
                  Dúvidas frequentes
                </a>
              </div>

              <div style={styles.footerColumn}>
                <div style={styles.footerColumnTitle}>Avaliações</div>
                <div style={styles.ratingBox}>
                  <div style={styles.ratingStars}>★★★★★</div>
                  <div style={styles.ratingText}>
                    Clientes satisfeitos com nossos produtos e serviços.
                  </div>
                </div>
              </div>
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
