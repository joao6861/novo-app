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
    textAlign: "center",
  },
  container: {
    width: "100%",
    maxWidth: "960px",
  },
  logoTitle: {
    fontSize: 22,
    fontWeight: 700,
    margin: 0,
  },
  logoSubtitle: {
    fontSize: 12,
    margin: 0,
    opacity: 0.9,
  },
  topBlock: {
    marginBottom: 16,
  },
  navLine: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 13,
  },
  navStrong: {
    display: "inline-block",
    margin: "0 8px",
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.7)",
    background: "rgba(0,0,0,0.18)",
    fontSize: 12,
  },
  heroSearchBtn: {
    display: "inline-block",
    marginBottom: 18,
    padding: "6px 26px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.7)",
    background: "rgba(0,0,0,0.2)",
    color: "#ffffff",
    fontSize: 13,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  heroKicker: {
    fontSize: 13,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    margin: "0 0 8px 0",
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
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 8,
    fontSize: 20,
    fontWeight: 600,
  },
  sectionSub: {
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
  footer: {
    marginTop: 32,
    paddingTop: 12,
    borderTop: "1px solid rgba(255,255,255,0.3)",
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
      <div style={styles.container}>
        {/* TOPO */}
        <div style={styles.topBlock}>
          <h1 style={styles.logoTitle}>Tureggon</h1>
          <p style={styles.logoSubtitle}>Sistema Online</p>
        </div>

        {/* LINHA COM AS OPÇÕES (texto bem simples) */}
        <p style={styles.navLine}>
          <span style={styles.navStrong}>Buscar por Placa</span>
          <span style={styles.navStrong}>Buscar sem Placa</span>
          <span style={styles.navStrong}>Oficinas Próximas</span>
        </p>

        {/* BOTÃO BUSCAR */}
        <button type="button" style={styles.heroSearchBtn}>
          Buscar
        </button>

        {/* HERO / CONTEÚDO PRINCIPAL */}
        <p style={styles.heroKicker}>Consulta Veicular Inteligente</p>

        <h2 style={styles.heroTitle}>Descubra Tudo Sobre Seu Veículo</h2>

        <p style={styles.heroText}>
          Consulta completa de dados veiculares, especificações técnicas e
          informações de manutenção em segundos.
        </p>

        <p style={styles.heroAlert}>
          Busca manual temporariamente indisponível. Use a busca por placa.
        </p>

        {/* POR QUE ESCOLHER A TUREGGON */}
        <h3 style={styles.sectionTitle}>Por que escolher a Tureggon?</h3>
        <p style={styles.sectionSub}>
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
            Resultados em segundos. Digite a placa e tenha todas as informações
            na tela.
          </p>

          <p style={styles.whyItemTitle}>Dados Seguros</p>
          <p style={styles.whyItemText}>
            Informações confiáveis e atualizadas com total segurança e
            privacidade.
          </p>
        </div>

        {/* RODAPÉ */}
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
