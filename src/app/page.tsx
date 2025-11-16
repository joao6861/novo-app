"use client";

import React from "react";

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #00c2ff 0%, #0077ff 100%)",
    color: "#ffffff",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    boxSizing: "border-box",
  },

  // TOPO (logo + sistema online + cartões + barra de busca)
  topArea: {
    padding: "24px 16px 12px",
  },
  topInner: {
    width: "100%",
    maxWidth: 1100,
    margin: "0 auto",
  },
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
    padding: "6px 16px",
    fontSize: 11,
    background: "rgba(0,0,0,0.18)",
    cursor: "pointer",
  },

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
    boxShadow: "0 6px 14px rgba(15,23,42,0.18)",
  },
  cardIcon: {
    width: 18,
    textAlign: "center",
    opacity: 0.8,
  },
  cardLabel: {
    fontWeight: 500,
  },

  searchRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 8,
    marginBottom: 12,
    marginTop: 6,
  },
  searchInput: {
    width: "100%",
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.7)",
    background: "rgba(0,0,0,0.05)",
    color: "#ffffff",
    padding: "10px 14px",
    fontSize: 13,
  },
  searchBtn: {
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.7)",
    padding: "0 18px",
    background: "rgba(0,0,0,0.18)",
    color: "#ffffff",
    fontSize: 13,
    cursor: "pointer",
  },

  // HERO ESCURO EM LARGURA TOTAL
  heroOuter: {
    background:
      "radial-gradient(circle at top, #101827 0%, #020617 40%, #020617 100%)",
    padding: "56px 16px 44px",
    boxShadow: "0 -10px 30px rgba(0,0,0,0.45)",
  },
  heroInner: {
    width: "100%",
    maxWidth: 1100,
    margin: "0 auto",
    textAlign: "center",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    border: "1px solid rgba(56,189,248,0.6)",
    padding: "6px 16px",
    fontSize: 11,
    marginBottom: 24,
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
    fontSize: 40,
    fontWeight: 800,
    margin: "0 0 4px 0",
  },
  heroTitleLine2: {
    fontSize: 40,
    fontWeight: 800,
    margin: 0,
    color: "#60a5fa",
  },
  heroText: {
    marginTop: 18,
    marginBottom: 0,
    fontSize: 15,
    opacity: 0.92,
    maxWidth: 720,
    marginLeft: "auto",
    marginRight: "auto",
  },

  // WHY SECTION (volta para o azul claro)
  whyOuter: {
    padding: "32px 16px 40px",
  },
  whyInner: {
    width: "100%",
    maxWidth: 1100,
    margin: "0 auto",
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

  // FOOTER
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.3)",
    paddingTop: 14,
    paddingBottom: 24,
    textAlign: "center",
    fontSize: 12,
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
      {/* TOPO */}
      <section style={styles.topArea}>
        <div style={styles.topInner}>
          <header style={styles.header}>
            <div style={styles.logoBlock}>
              <span style={styles.logoMain}>TUREGGON STORE</span>
              <span style={styles.logoSub}>CONSULTA VEICULAR</span>
            </div>
            <button type="button" style={styles.systemButton}>
              Sistema Online
            </button>
          </header>

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
        </div>
      </section>

      {/* HERO ESCURO EM LARGURA TOTAL */}
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
        </div>
      </section>

      {/* RODAPÉ */}
      <footer style={styles.footer}>
        <div style={styles.footerLogo}>Tureggon</div>
        <p style={styles.footerLine}>Sistema Online e Operacional</p>
        <p style={styles.footerLine}>
          © 2024 Tureggon. Todos os direitos reservados.
        </p>
        <p style={styles.footerLine}>Consulta veicular inteligente e segura</p>
      </footer>
    </main>
  );
}
