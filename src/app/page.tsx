"use client";

import React from "react";

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "32px 16px 48px",
    color: "#ffffff",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    boxSizing: "border-box",
  },
  container: {
    width: "100%",
    maxWidth: "960px",
    display: "flex",
    flexDirection: "column",
    minHeight: "calc(100vh - 80px)",
  },
  topBar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    marginBottom: 32,
    textAlign: "center",
  },
  brandBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  brandLogo: {
    fontWeight: 700,
    fontSize: 20,
  },
  brandStatus: {
    fontSize: 12,
    opacity: 0.85,
  },
  nav: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  navBtn: {
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.7)",
    padding: "6px 14px",
    fontSize: 12,
    background: "rgba(0,0,0,0.2)",
    color: "#ffffff",
    cursor: "pointer",
  },
  navBtnSecondary: {
    border: "1px solid rgba(255,255,255,0.4)",
    background: "rgba(0,0,0,0.1)",
  },
  hero: {
    textAlign: "center",
    marginBottom: 40,
  },
  heroSearchBtn: {
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.7)",
    padding: "6px 20px",
    background: "rgba(0,0,0,0.2)",
    color: "#ffffff",
    fontSize: 13,
    cursor: "pointer",
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontWeight: 600,
  },
  heroKicker: {
    fontSize: 16,
    fontWeight: 600,
    margin: "0 0 6px 0",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 700,
    margin: "0 0 10px 0",
  },
  heroText: {
    margin: "0 0 8px 0",
    fontSize: 14,
    maxWidth: 640,
    marginLeft: "auto",
    marginRight: "auto",
  },
  heroAlert: {
    margin: 0,
    fontSize: 13,
    opacity: 0.9,
  },
  why: {
    textAlign: "center",
    marginBottom: 40,
  },
  whyTitle: {
    margin: "0 0 12px 0",
    fontSize: 20,
    fontWeight: 600,
  },
  whySub: {
    margin: "0 0 20px 0",
    fontSize: 14,
    maxWidth: 640,
    marginLeft: "auto",
    marginRight: "auto",
  },
  whyBlock: {
    maxWidth: 700,
    margin: "0 auto",
    textAlign: "left",
    lineHeight: 1.5,
  },
  whyItemTitle: {
    margin: "8px 0 0 0",
    fontSize: 15,
    fontWeight: 700,
  },
  whyItemText: {
    margin: 0,
    fontSize: 13,
  },
  footer: {
    marginTop: "auto",
    borderTop: "1px solid rgba(255,255,255,0.25)",
    paddingTop: 16,
    textAlign: "center",
    fontSize: 12,
  },
  footerLogo: {
    fontWeight: 700,
    marginBottom: 4,
  },
  footerStatus: {
    marginBottom: 4,
  },
  footerCopy: {
    marginBottom: 2,
    opacity: 0.9,
  },
  footerSub: {
    opacity: 0.9,
  },
};

export default function Home() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* TOPO – LOGO + SISTEMA ONLINE + MENU */}
        <header style={styles.topBar}>
          <div style={styles.brandBlock}>
            <span style={styles.brandLogo}>Tureggon</span>
            <span style={styles.brandStatus}>Sistema Online</span>
          </div>

          <nav style={styles.nav}>
            <button type="button" style={styles.navBtn}>
              Buscar por Placa
            </button>
            <button
              type="button"
              style={{ ...styles.navBtn, ...styles.navBtnSecondary }}
            >
              Buscar sem Placa
            </button>
            <button
              type="button"
              style={{ ...styles.navBtn, ...styles.navBtnSecondary }}
            >
              Oficinas Próximas
            </button>
          </nav>
        </header>

        {/* HERO */}
        <section style={styles.hero}>
          <button type="button" style={styles.heroSearchBtn}>
            Buscar
          </button>

          <p style={styles.heroKicker}>Consulta Veicular Inteligente</p>

          <h1 style={styles.heroTitle}>Descubra Tudo Sobre Seu Veículo</h1>

          <p style={styles.heroText}>
            Consulta completa de dados veiculares, especificações técnicas e
            informações de manutenção em segundos.
          </p>

          <p style={styles.heroAlert}>
            Busca manual temporariamente indisponível. Use a busca por placa.
          </p>
        </section>

        {/* POR QUE ESCOLHER A TUREGGON (só texto, igual à Lasy) */}
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

        {/* RODAPÉ */}
        <footer style={styles.footer}>
          <div style={styles.footerLogo}>Tureggon</div>
          <div style={styles.footerStatus}>Sistema Online e Operacional</div>
          <div style={styles.footerCopy}>
            © 2024 Tureggon. Todos os direitos reservados.
          </div>
          <div style={styles.footerSub}>
            Consulta veicular inteligente e segura
          </div>
        </footer>
      </div>
    </main>
  );
}
