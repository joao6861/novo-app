"use client";

import React from "react";

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "24px 16px 48px",
    color: "#ffffff",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    boxSizing: "border-box",
  },
  container: {
    width: "100%",
    maxWidth: "1100px",
  },

  /* HEADER */
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logoBlock: {
    display: "flex",
    flexDirection: "column",
  },
  logoMain: {
    fontWeight: 800,
    letterSpacing: "0.08em",
    fontSize: 20,
  },
  logoSub: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
  },
  systemButton: {
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.7)",
    padding: "6px 14px",
    fontSize: 11,
    background: "rgba(0,0,0,0.15)",
    cursor: "pointer",
  },

  /* TOP SEARCH CARDS */
  cardsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 10,
    marginTop: 16,
    marginBottom: 10,
  },
  card: {
    background: "#ffffff",
    color: "#0f172a",
    borderRadius: 8,
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    cursor: "pointer",
  },
  cardIcon: {
    width: 18,
    textAlign: "center",
    opacity: 0.8,
  },
  cardLabel: {
    fontWeight: 500,
  },

  /* SEARCH BAR */
  searchRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 8,
    marginBottom: 32,
    marginTop: 6,
  },
  searchInput: {
    width: "100%",
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.6)",
    background: "rgba(0,0,0,0.07)",
    color: "#ffffff",
    padding: "10px 14px",
    fontSize: 13,
  },
  searchBtn: {
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.7)",
    padding: "0 18px",
    background: "rgba(0,0,0,0.15)",
    color: "#ffffff",
    fontSize: 13,
    cursor: "pointer",
  },

  /* HERO DARK SECTION */
  hero: {
    borderRadius: 24,
    padding: "40px 24px 36px",
    background:
      "radial-gradient(circle at top, #101827 0%, #020617 45%, #020617 100%)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
    textAlign: "center",
    marginBottom: 32,
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    border: "1px solid rgba(56,189,248,0.6)",
    padding: "6px 14px",
    fontSize: 11,
    marginBottom: 20,
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(8,47,73,0.9))",
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
    fontSize: 34,
    fontWeight: 800,
    margin: "0 0 4px 0",
  },
  heroTitleLine2: {
    fontSize: 34,
    fontWeight: 800,
    margin: 0,
    color: "#60a5fa", // azul do “Seu Veículo”
  },
  heroText: {
    marginTop: 14,
    marginBottom: 0,
    fontSize: 14,
    opacity: 0.92,
  },

  /* WHY SECTION */
  why: {
    textAlign: "center",
  },
  whyTitle: {
    marginTop: 0,
    marginBottom: 8,
    fontSize: 20,
    fontWeight: 600,
  },
  whySub: {
    marginTop: 0,
    marginBottom: 24,
    fontSize: 14,
  },
  whyBlock: {
    maxWidth: 640,
    margin: "0 auto",
    textAlign: "left",
    lineHeight: 1.5,
    fontSize: 13,
  },
  whyItemTitle: {
    margin: "10px 0 0 0",
    fontWeight: 700,
  },
  whyItemText: {
    margin: 0,
  },

  /* FOOTER */
  footer: {
    marginTop: 32,
    paddingTop: 12,
    borderTop: "1px solid rgba(255,255,255,0.3)",
    fontSize: 12,
    textAlign: "center",
  },
  footerLogo: {
    fontWeight: 700,
    marginBottom: 4,
  },
  footerLine: {
    margin: 0,
  },
};

export default function Home() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.logoBlock}>
            <span style={styles.logoMain}>TUREGGON STORE</span>
            <span style={styles.logoSub}>CONSULTA VEICULAR</span>
          </div>
          <button type="button" style={styles.systemButton}>
            Sistema Online
          </button>
        </header>

        {/* TOP SEARCH CARDS */}
        <div style={styles.cardsRow}>
          <button type="button" style={styles.card}>
            <span style={styles.cardIcon}>🔍</span>
            <span style={styles.cardLabel}>Buscar por Placa</span>
          </button>
          <button type="button" style={styles.card}>
            <span style={styles.cardIcon}>≡</span>
            <span style={styles.cardLabel}>Buscar sem Placa</span>
          </button>
          <button type="button" style={styles.card}>
            <span style={styles.cardIcon}>📍</span>
            <span style={styles.cardLabel}>Oficinas Próximas</span>
          </button>
        </div>

        {/* SEARCH BAR */}
        <div style={styles.searchRow}>
          <input
            type="text"
            placeholder="Digite a placa (ex: ABC1234)"
            style={styles.searchInput}
          />
          <button type="button" style={styles.searchBtn}>
            Buscar
          </button>
        </div>

        {/* HERO DARK SECTION */}
        <section style={styles.hero}>
          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeIcon}>⚡</span>
            <span style={styles.heroBadgeText}>Consulta Veicular Inteligente</span>
          </div>

          <h1 style={styles.heroTitleLine1}>Descubra Tudo Sobre</h1>
          <h1 style={styles.heroTitleLine2}>Seu Veículo</h1>

          <p style={styles.heroText}>
            Consulta completa de dados veiculares, especificações técnicas e
            informações de manutenção em segundos.
          </p>
        </section>

        {/* POR QUE ESCOLHER A TUREGGON */}
        <section style={styles.why}>
          <h2 style={styles.whyTitle}>Por que escolher a Tureggon?</h2>
          <p style={styles.whySub}>
            Tecnologia de ponta para consultas veiculares completas e precisas.
          </p>

          <div style={styles.whyBlock}>
            <p style={styles.whyItemTitle}>Base Completa</p>
            <p style={styles.whyItemText}>
              Milhares de veículos nacionais e importados em nossa base de dados
              atualizada.
            </p>

            <p style={styles.whyItemTitle}>Consulta Rápida</p>
            <p style={styles.whyItemText}>
              Resultados em segundos. Digite a placa e tenha todas as
              informações na tela.
            </p>

            <p style={styles.whyItemTitle}>Dados Seguros</p>
            <p style={styles.whyItemText}>
              Informações confiáveis e atualizadas com total segurança e
              privacidade.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <div style={styles.footerLogo}>Tureggon</div>
          <p style={styles.footerLine}>Sistema Online e Operacional</p>
          <p style={styles.footerLine}>
            © 2024 Tureggon. Todos os direitos reservados.
          </p>
          <p style={styles.footerLine}>Consulta veicular inteligente e segura</p>
        </footer>
      </div>
    </main>
  );
}
