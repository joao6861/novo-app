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

/** Utilitário: transforma string em lista de tokens normalizados */
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

/** Normaliza a marca para bater com a base interna */
function canonicalizarMarcaPlaca(marcaPlaca: string): string {
  let up = marcaPlaca.toUpperCase().trim();

  // Trata coisas tipo "GM/CHEVROLET", "FIAT/ABARTH" etc.
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

/** Calcula um score de similaridade entre os dados da placa e um veículo da base */
function calcularScoreMatch(info: PlacaInfo, v: any): number {
  let score = 0;

  // MODELO + VERSÃO (tokens em comum)
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

  // ANO
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

  // COMBUSTÍVEL
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

  // POTÊNCIA
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

/** Usa os dados da placa para buscar os melhores veículos na base */
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

/** ESTILOS INLINE (mantém a mesma pegada visual) */
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
};

/** Componente principal da página */
export default function Home() {
  const [mode, setMode] = useState<"plate" | "manual">("plate");
  const plateInputRef = useRef<HTMLInputElement | null>(null);
  const brandSelectRef = useRef<HTMLSelectElement | null>(null);
  const searchBlockRef = useRef<HTMLDivElement | null>(null);

  // estados para busca manual
  const [brand, setBrand] = useState("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");

  // resultados base interna
  const [manualResults, setManualResults] = useState<any[]>([]);
  const [plateVehicleMatches, setPlateVehicleMatches] = useState<any[]>([]);

  // estados consulta de placa
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

      {/* ÓLEOS E FLUIDOS */}
      <div style={{ marginTop: 8 }}>
        <div style={{ ...styles.resultSectionTitle, marginBottom: 6 }}>
          Óleos e fluidos
        </div>
        <div style={styles.resultGrid}>
          <div style={styles.resultItem}>
            <span style={styles.resultItemLabel}>Óleo do motor</span>
            <span style={styles.resultItemValue}>
              {v.oleo_motor_litros ? `${v.oleo_motor_litros} L` : "—"}
            </span>
            {v.oleo_motor_viscosidade && (
              <span style={{ fontSize: 11, marginTop: 4 }}>
                {v.oleo_motor_viscosidade}
              </span>
            )}
            {v.oleo_motor_especificacao && (
              <span style={{ fontSize: 11 }}>
                {v.oleo_motor_especificacao}
              </span>
            )}
          </div>

          {(v.oleo_cambio_manual_litros ||
            v.oleo_cambio_manual_viscosidade ||
            v.oleo_cambio_manual_especificacao) && (
            <div style={styles.resultItem}>
              <span style={styles.resultItemLabel}>Câmbio manual</span>
              <span style={styles.resultItemValue}>
                {v.oleo_cambio_manual_litros
                  ? `${v.oleo_cambio_manual_litros} L`
                  : "—"}
              </span>
              {v.oleo_cambio_manual_viscosidade && (
                <span style={{ fontSize: 11, marginTop: 4 }}>
                  {v.oleo_cambio_manual_viscosidade}
                </span>
              )}
              {v.oleo_cambio_manual_especificacao && (
                <span style={{ fontSize: 11 }}>
                  {v.oleo_cambio_manual_especificacao}
                </span>
              )}
            </div>
          )}

          {(v.oleo_cambio_auto_total_litros ||
            v.oleo_cambio_auto_parcial_litros ||
            v.oleo_cambio_auto_especificacao) && (
            <div style={styles.resultItem}>
              <span style={styles.resultItemLabel}>Câmbio automático</span>
              <span style={styles.resultItemValue}>
                {v.oleo_cambio_auto_total_litros
                  ? `Total: ${v.oleo_cambio_auto_total_litros} L`
                  : "—"}
              </span>
              {v.oleo_cambio_auto_parcial_litros && (
                <span style={{ fontSize: 11 }}>
                  Parcial: {v.oleo_cambio_auto_parcial_litros} L
                </span>
              )}
              {v.oleo_cambio_auto_especificacao && (
                <span style={{ fontSize: 11 }}>
                  {v.oleo_cambio_auto_especificacao}
                </span>
              )}
            </div>
          )}

          {v.aditivo_radiador_litros && (
            <div style={styles.resultItem}>
              <span style={styles.resultItemLabel}>
                Aditivo do radiador
              </span>
              <span style={styles.resultItemValue}>
                {v.aditivo_radiador_litros} L
              </span>
              {v.aditivo_radiador_tipo && (
                <span style={{ fontSize: 11, marginTop: 4 }}>
                  {v.aditivo_radiador_tipo}
                </span>
              )}
              {v.aditivo_radiador_cor && (
                <span style={{ fontSize: 11 }}>
                  {v.aditivo_radiador_cor}
                </span>
              )}
            </div>
          )}

          {(v.fluido_freio_litros || v.fluido_freio_tipo) && (
            <div style={styles.resultItem}>
              <span style={styles.resultItemLabel}>Fluido de freio</span>
              <span style={styles.resultItemValue}>
                {v.fluido_freio_litros ? `${v.fluido_freio_litros} L` : "—"}
              </span>
              {v.fluido_freio_tipo && (
                <span style={{ fontSize: 11 }}>{v.fluido_freio_tipo}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FILTROS */}
      <div style={{ marginTop: 8 }}>
        <div style={{ ...styles.resultSectionTitle, marginBottom: 6 }}>
          Filtros
        </div>
        <div style={styles.resultGrid}>
          {v.filtros?.oleo?.length > 0 && (
            <div style={styles.resultItem}>
              <span style={styles.resultItemLabel}>Filtro de óleo</span>
              {v.filtros.oleo.map((f: any, i: number) => (
                <span key={i} style={{ fontSize: 11 }}>
                  {f.marca}: {f.codigo}
                </span>
              ))}
            </div>
          )}

          {v.filtros?.ar?.length > 0 && (
            <div style={styles.resultItem}>
              <span style={styles.resultItemLabel}>Filtro de ar</span>
              {v.filtros.ar.map((f: any, i: number) => (
                <span key={i} style={{ fontSize: 11 }}>
                  {f.marca}: {f.codigo}
                </span>
              ))}
            </div>
          )}

          {v.filtros?.cabine?.length > 0 && (
            <div style={styles.resultItem}>
              <span style={styles.resultItemLabel}>Filtro de cabine</span>
              {v.filtros.cabine.map((f: any, i: number) => (
                <span key={i} style={{ fontSize: 11 }}>
                  {f.marca}: {f.codigo}
                </span>
              ))}
            </div>
          )}

          {v.filtros?.combustivel?.length > 0 && (
            <div style={styles.resultItem}>
              <span style={styles.resultItemLabel}>
                Filtro de combustível
              </span>
              {v.filtros.combustivel.map((f: any, i: number) => (
                <span key={i} style={{ fontSize: 11 }}>
                  {f.marca}: {f.codigo}
                </span>
              ))}
            </div>
          )}

          {v.filtros?.cambio_auto?.length > 0 && (
            <div style={styles.resultItem}>
              <span style={styles.resultItemLabel}>
                Filtro do câmbio automático
              </span>
              {v.filtros.cambio_auto.map((f: any, i: number) => (
                <span key={i} style={{ fontSize: 11 }}>
                  {f.marca}: {f.codigo}
                </span>
              ))}
            </div>
          )}
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
      {/* TOPO / MENU */}
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

          {/* CARDS: POR PLACA / SEM PLACA / OFICINAS */}
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

          {/* BLOCO DAS BUSCAS */}
          <div style={styles.searchWrapper} ref={searchBlockRef}>
            {mode === "plate" && (
              <>
                {/* BUSCA POR PLACA */}
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

                {/* RESULTADO DA PLACA + BASE INTERNA */}
                {plateResult && (
                  <div style={styles.resultWrapper}>
                    {/* 1. DADOS GERAIS */}
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

                    {/* 2. ESPECIFICAÇÕES TÉCNICAS */}
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

                    {/* 3. LOCALIZAÇÃO E DOCUMENTOS */}
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
                      </div>
                    </div>

                    {/* 4. SITUAÇÃO, RESTRIÇÕES, FIPE E MULTAS */}
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

                    {/* 5. INFORMAÇÕES DE MANUTENÇÃO (BASE INTERNA) */}
                    {plateVehicleMatches.length > 0 && (
                      <div style={styles.resultSection}>
                        <div style={styles.resultSectionTitle}>
                          Informações de manutenção (base interna)
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

            {/* MODO MANUAL */}
            {mode === "manual" && (
              <>
                <div style={styles.manualGrid}>
                  {/* MARCA */}
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

                  {/* MODELO */}
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

                {/* RESULTADO BASE INTERNA - MANUAL */}
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

      {/* HERO */}
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

      {/* POR QUE TUREGGON */}
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

      {/* NEWSLETTER */}
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

      {/* RODAPÉ */}
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
