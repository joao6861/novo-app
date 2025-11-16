"use client";

import React from "react";

export default function Home() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* Cabeçalho */}
        <header style={styles.header}>
          <div style={styles.badge}>
            <span style={styles.badgeBrand}>TUREGGON</span>
            <span style={styles.badgeText}>SISTEMA ONLINE</span>
          </div>

          <h1 style={styles.title}>Consulta de veículos</h1>
          <p style={styles.subtitle}>
            Escolha uma opção abaixo para iniciar sua consulta.
          </p>
        </header>

        {/* Card principal */}
        <section style={styles.card}>
          <div style={styles.grid}>
            {/* OPÇÃO 1 */}
            <button
              type="button"
              style={{ ...styles.option, ...styles.optionPrimary }}
              onClick={() => alert("Em breve: busca por PLACA integrada 🚗")}
            >
              <span style={styles.optionTag}>OPÇÃO 1</span>
              <span style={styles.optionTitle}>Buscar por placa</span>
              <span style={styles.optionText}>
                Digite a placa para puxar os dados do veículo.
              </span>
            </button>

            {/* OPÇÃO 2 */}
            <button
              type="button"
              style={styles.option}
              onClick={() =>
                alert("Em breve: busca por modelo/ano sem placa 🔍")
              }
            >
              <span style={styles.optionTag}>OPÇÃO 2</span>
              <span style={styles.optionTitle}>Buscar sem placa</span>
              <span style={styles.optionText}>
                Selecione marca, modelo, ano e motorização.
              </span>
            </button>

            {/* OPÇÃO 3 */}
            <button
              type="button"
              style={{ ...styles.option, ...styles.optionGreen }}
              onClick={() =>
                alert("Em breve: mapa de oficinas parceiras Tureggon 📍")
              }
            >
              <span style={styles.optionTag}>OPÇÃO 3</span>
              <span style={styles.optionTitle}>Oficinas próximas</span>
              <span style={styles.optionText}>
                Veja as oficinas parceiras mais perto de você.
              </span>
            </button>
          </div>

          <p style={styles.footer}>
            Esta é uma versão de apresentação. Depois conectamos às consultas
            reais (Auto Óleo / banco de dados).
          </p>
        </section>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    // deixa o fundo transparente para usar o degradê que já está no body
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 16px",
    color: "#ffffff",
    boxSizing: "border-box",
  },
  container: {
    width: "100%",
    maxWidth: "960px",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: 24,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 14px",
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.25)",
    fontSize: 10,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
  },
  badgeBrand: {
    fontWeight: 700,
  },
  badgeText: {
    opacity: 0.75,
  },
  title: {
    marginTop: 16,
    marginBottom: 4,
    fontSize: 32,
    fontWeight: 700,
  },
  subtitle: {
    margin: 0,
    fontSize: 14,
    opacity: 0.9,
  },
  card: {
    backgroundColor: "rgba(10, 22, 40, 0.92)",
    borderRadius: 18,
    padding: "24px 20px",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  option: {
    textAlign: "left" as const,
    borderRadius: 14,
    padding: "14px 14px",
    border: "1px solid rgba(255,255,255,0.16)",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.7))",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column" as const,
    gap: 6,
    transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s",
  },
  optionPrimary: {
    borderColor: "rgba(56,189,248,0.85)",
    background:
      "linear-gradient(135deg, rgba(8,47,73,0.95), rgba(56,189,248,0.2))",
  },
  optionGreen: {
    borderColor: "rgba(52,211,153,0.9)",
    background:
      "linear-gradient(135deg, rgba(6,78,59,0.95), rgba(52,211,153,0.2))",
  },
  optionTag: {
    fontSize: 10,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    opacity: 0.8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 600,
  },
  optionText: {
    fontSize: 12,
    opacity: 0.9,
  },
  footer: {
    marginTop: 20,
    fontSize: 11,
    textAlign: "center" as const,
    opacity: 0.8,
  },
};
