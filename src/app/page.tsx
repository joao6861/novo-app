"use client";

import React, { useState, useRef } from "react";
// Se você NÃO estiver usando Card/Button/Input/Label, pode apagar esses imports abaixo:
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  vehicleBrands,
  getModelsByBrand,
  type VehicleModel,
} from "@/lib/vehicle-data";

/** ÍCONES SVG PERSONALIZADOS **/

const CarIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    width={32}
    height={32}
    fill="none"
    stroke="#ffffff"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 14.5V12c0-.6.3-1.1.9-1.4l2.3-1.2c.4-.2.8-.4 1.2-.5L10.2 8c.6-.2 1-.3 1.8-.3h2c.7 0 1.1.1 1.7.3l1.9.6c.5.2.9.3 1.3.6l1.2.8c.5.3.9.9.9 1.5v2.6" />
    <path d="M4 18.5h-.5C3 18.5 2.5 18 2.5 17.5V15" />
    <path d="M20 18.5h.5c.5 0 1-.5 1-1V15" />
    <path d="M7.5 18.5h9" />
    <path d="M7.25 15.4a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z" />
    <path d="M16.75 15.4a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z" />
  </svg>
);

const ClockIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    width={32}
    height={32}
    fill="none"
    stroke="#ffffff"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l2.5 2.5" />
  </svg>
);

const ShieldIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    width={32}
    height={32}
    fill="none"
    stroke="#ffffff"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3.5 6.5 5.5c-.6.2-1 .8-1 1.5v4.9c0 1.7.8 3.4 2.2 4.6L12 21l4.3-4.5a6 6 0 0 0 1.7-4.2V7c0-.7-.4-1.3-1.1-1.5L12 3.5Z" />
    <path d="M9.5 12.2 11 13.7l3.5-3.5" />
  </svg>
);

/** TIPOS PARA CONSULTA DE PLACA **/

type PlacaInfo = {
  placa: string;
  titulo: string | null;
  resumo: string | null;
  marca: string | null;
  modelo: string | null;
  ano: string | null;
  ano_modelo: string | null;
  cor: string | null;
  cilindrada?: string | null;
  potencia?: string | null;
  combustivel: string | null;
  chassi_final?: string | null;
  motor?: string | null;
  passageiros?: string | null;
  uf: string | null;
  municipio: string | null;
  segmento?: string | null;
  especie?: string | null;
};

/** ESTILOS **/

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #00c2ff 0%, #0077ff 100%)",
    color: "#ffffff",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    boxSizing: "border-box",
  },

  /* TOPO (logo + sistema + cards + barra de busca) */
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
    background: "#ffffff", // fundo branco
    color: "#000000", // texto preto
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

  /* CAMPOS MANUAIS (Marca + Modelo) */
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

  /* HERO ESCURO EM LARGURA TOTAL */
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

  /* SEÇÃO "POR QUE ESCOLHER" COM CARDS */
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
  featureIconWrap: {
    width: 72,
    height: 72,
    margin: "0 auto 20px",
    borderRadius: 24,
    background:
      "linear-gradient(145deg, #22d3ee 0%, #2563eb 50%, #1d4ed8 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  featureIconWrapPurple: {
    width: 72,
    height: 72,
    margin: "0 auto 20px",
    borderRadius: 24,
    background:
      "linear-gradient(145deg, #a855f7 0%, #6366f1 50%, #4f46e5 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  featureIconWrapPink: {
    width: 72,
    height: 72,
    margin: "0 auto 20px",
    borderRadius: 24,
    background:
      "linear-gradient(145deg, #ec4899 0%, #8b5cf6 50%, #6d28d9 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

  /* NEWSLETTER (BANNER TARTARUGAS) */
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

  /* FOOTER SIMPLIFICADO */
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

export default function Home() {
  const [mode, setMode] = useState<"plate" | "manual">("plate");
  const plateInputRef = useRef<HTMLInputElement | null>(null);
  const brandSelectRef = useRef<HTMLSelectElement | null>(null);
  const searchBlockRef = useRef<HTMLDivElement | null>(null);

  // ESTADOS MARCA / MODELOS
  const [brand, setBrand] = useState("");
  const [availableModels, setAvailableModels] = useState<VehicleModel[]>([]);
  const [selectedModelCode, setSelectedModelCode] = useState("");

  // ESTADOS CONSULTA PLACA
  const [plate, setPlate] = useState("");
  const [plateLoading, setPlateLoading] = useState(false);
  const [plateError, setPlateError] = useState<string | null>(null);
  const [plateResult, setPlateResult] = useState<PlacaInfo | null>(null);

  const scrollToSearch = (target: "plate" | "manual") => {
    if (searchBlockRef.current) {
      searchBlockRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setTimeout(() => {
      if (target === "plate") {
        plateInputRef.current?.focus();
      } else {
        brandSelectRef.current?.focus();
      }
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
    const models = getModelsByBrand(value);
    setAvailableModels(models);
    setSelectedModelCode("");
  };

  // CONSULTA DE PLACA (chama /api/placa)
  const handleSearchClick = async () => {
    if (mode === "plate") {
      const value = plate.trim().toUpperCase();

      if (!value) {
        setPlateError("Digite a placa para realizar a consulta.");
        setPlateResult(null);
        return;
      }

      setPlateError(null);
      setPlateLoading(true);
      setPlateResult(null);

      try {
        const res = await fetch(`/api/placa?placa=${encodeURIComponent(value)}`);
        const body = await res.json();

        if (!res.ok || body.error) {
          // 🔹 AQUI está o ajuste: aproveita a mensagem e o status vindo da API
          const base = body.error || "Erro ao consultar a placa.";
          if (body.statusCode) {
            setPlateError(`${base} (código ${body.statusCode})`);
          } else {
            setPlateError(base);
          }
          return;
        }

        const data = body.data as PlacaInfo;
        setPlateResult(data);
      } catch (e) {
        console.error(e);
        setPlateError("Falha ao consultar a placa.");
      } finally {
        setPlateLoading(false);
      }
    } else {
      // Lógica da busca manual (marca + modelo) – por enquanto ainda em modo demonstração
      if (!brand || !selectedModelCode) {
        alert("Selecione marca e modelo para realizar a consulta.");
        return;
      }

      const selectedModel = availableModels.find(
        (m) => m.code === selectedModelCode
      );

      const modeloTexto = selectedModel?.label ?? "";

      alert(
        `Versão de apresentação.\n\nAqui nós vamos consultar o veículo no Auto Óleo usando:\n\nMarca: ${brand}\nModelo (texto exato): ${modeloTexto}`
      );
    }
  };

  // opções de marca (vem do vehicle-data.ts)
  const brandOptions = vehicleBrands.map((b) => b.brand).sort();

  return (
    <main style={styles.page}>
      {/* TOPO */}
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
                  <div
                    style={{
                      marginTop: 10,
                      padding: "12px 14px",
                      borderRadius: 10,
                      background: "rgba(15,23,42,0.9)",
                      border: "1px solid rgba(148,163,184,0.5)",
                      fontSize: 12,
                      textAlign: "left",
                    }}
                  >
                    {plateResult.titulo && (
                      <div
                        style={{
                          fontWeight: 600,
                          marginBottom: 4,
                        }}
                      >
                        {plateResult.titulo}
                      </div>
                    )}
                    {plateResult.resumo && (
                      <div style={{ marginBottom: 6 }}>
                        {plateResult.resumo}
                      </div>
                    )}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 4,
                      }}
                    >
                      <div>
                        <strong>Placa:</strong> {plateResult.placa}
                      </div>
                      <div>
                        <strong>Marca:</strong> {plateResult.marca}
                      </div>
                      <div>
                        <strong>Modelo:</strong> {plateResult.modelo}
                      </div>
                      <div>
                        <strong>Ano:</strong> {plateResult.ano}
                      </div>
                      <div>
                        <strong>Ano Modelo:</strong> {plateResult.ano_modelo}
                      </div>
                      <div>
                        <strong>Cor:</strong> {plateResult.cor}
                      </div>
                      <div>
                        <strong>Combustível:</strong>{" "}
                        {plateResult.combustivel}
                      </div>
                      <div>
                        <strong>UF:</strong> {plateResult.uf}
                      </div>
                      <div>
                        <strong>Município:</strong> {plateResult.municipio}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

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
                      Modelo (texto exato da tabela)
                    </label>
                    <select
                      style={styles.manualSelect}
                      value={selectedModelCode}
                      onChange={(e) => setSelectedModelCode(e.target.value)}
                      disabled={!brand || availableModels.length === 0}
                    >
                      <option value="">
                        {brand
                          ? "Selecione o modelo"
                          : "Escolha primeiro a marca"}
                      </option>
                      {availableModels.map((m) => (
                        <option key={m.code} value={m.code}>
                          {m.label}
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
                  . O modelo usa o mesmo texto que o Auto Óleo / sua tabela para
                  facilitar a busca.
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* HERO ESCURO */}
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

      {/* POR QUE ESCOLHER A TUREGGON */}
      <section style={styles.whyOuter}>
        <div style={styles.whyInner}>
          <h2 style={styles.whyTitle}>Por que escolher a Tureggon?</h2>
          <p style={styles.whySub}>
            Tecnologia de ponta para consultas veiculares completas e precisas.
          </p>

          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIconWrap}>
                <CarIcon />
              </div>
              <h3 style={styles.featureTitle}>Base Completa</h3>
              <p style={styles.featureText}>
                Milhares de veículos nacionais e importados em nossa base de
                dados atualizada.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIconWrapPurple}>
                <ClockIcon />
              </div>
              <h3 style={styles.featureTitle}>Consulta Rápida</h3>
              <p style={styles.featureText}>
                Resultados em segundos. Digite a placa e tenha todas as
                informações na tela.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIconWrapPink}>
                <ShieldIcon />
              </div>
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
                href="https://www.google.com/maps/place/TUREGGON/@-27.7229965,-62.6404099,2591015m/data=!3m2!1e3!4b1!4m6!3m5!1s0x94dcfb2b8bb6b5db:0xc19deb1a9509a901!8m2!3d-28.1336936!4d-52.006782!16s%2Fg%2F11nmgpmlpr?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
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
