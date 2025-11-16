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

  /* TOPO (logo + sistema + cards + barra de placa) */
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
  },
  cardIcon: {
    width: 18,
    textAlign: "center",
    opacity: 0.75,
  },
  cardLabel: {
    fontWeight: 500,
  },

  searchRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 8,
    marginBottom: 28,
    marginTop: 8,
  },
  searchInput: {
    width: "100%",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.6)",
    background: "rgba(255,255,255,0.12)",
    color: "#ffffff",
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

  /* WHY SECTION */
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

  /* NEWSLETTER (BANNER TARTARUGAS) */
  newsletterOuter: {
    padding: "60px 16px 80px", // mais altura pra caber a arte inteira
    backgroundColor: "#00b7ff",
    backgroundImage: "url('/newsletter-banner.png')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center bottom", // tartarugas presas embaixo
    backgroundSize: "contain", // mostra a imagem inteira, sem cortar
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
    backgroundColor: "#39ff14", // verde forte como no print
    color: "#000000",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },

  /* FOOTER - ESTILO TUREGGON.COM */
  footerOuter: {
    backgroundColor: "#000000",
    color: "#ffffff",
    padding: "32px 16px 16px",
  },
  footerInner: {
    width: "100%",
    maxWidth: 1100,
    margin: "0 auto",
  },
  footerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 40,
    paddingBottom: 24,
    borderBottom: "1px solid #111827",
  },
  footerColumn: {
    flex: 1,
    minWidth: 220,
  },
  footerTitle: {
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: 14,
    fontWeight: 700,
  },
  footerLink: {
    fontSize: 13,
    marginBottom: 6,
  },
  footerPhone: {
    fontSize: 13,
    marginBottom: 6,
  },

  footerBottom: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    paddingTop: 18,
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

  // nova config para a imagem de avaliação do Google
  ratingRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
  },
  ratingImage: {
    height: 48, // ajusta o tamanho da imagem aqui
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
  return (
    <main style={styles.page}>
      {/* TOPO */}
      <section style={styles.topArea}>
        <div style={styles.topInner}>
          <header style={styles.header}>
            <div style={styles.logoBlock}>
              <img
                src="/logo.png"
                alt="Tureggon Store"
                style={styles.logoImage}
              />
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

      {/* NEWSLETTER COM BANNER DAS TARTARUGAS */}
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
              // aqui depois você pode integrar com algum serviço de email
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

      {/* RODAPÉ ESTILO TUREGGON.COM */}
      <footer style={styles.footerOuter}>
        <div style={styles.footerInner}>
          <div style={styles.footerTop}>
            <div style={styles.footerColumn}>
              <div style={styles.footerTitle}>DEPARTAMENTOS</div>
              <div style={styles.footerLink}>Início</div>
              <div style={styles.footerLink}>Manutenção</div>
              <div style={styles.footerLink}>Performance</div>
              <div style={styles.footerLink}>Acessórios &amp; Cuidados</div>
              <div style={styles.footerLink}>Elétrica &amp; tecnologia</div>
              <div style={styles.footerLink}>Instagram</div>
              <div style={styles.footerLink}>Consulta Veicular</div>
            </div>

            <div style={styles.footerColumn}>
              <div style={styles.footerTitle}>ENTRE EM CONTATO</div>
              <div style={styles.footerPhone}>5541997744692</div>
              <div style={styles.footerPhone}>41997744692</div>
            </div>
          </div>

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

            {/* Avaliação Google clicável */}
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
