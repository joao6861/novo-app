"use client";

export default function Home() {
  return (
    <>
      <main className="page">
        {/* TOPO – LOGO + SISTEMA ONLINE + MENU */}
        <header className="top-bar">
          <div className="brand-block">
            <div className="brand-logo">Tureggon</div>
            <div className="brand-status">Sistema Online</div>
          </div>

          <nav className="nav">
            <button type="button" className="nav-btn">
              Buscar por Placa
            </button>
            <button type="button" className="nav-btn nav-btn-secondary">
              Buscar sem Placa
            </button>
            <button type="button" className="nav-btn nav-btn-secondary">
              Oficinas Próximas
            </button>
          </nav>
        </header>

        {/* HERO / CONTEÚDO PRINCIPAL (como na Lasy) */}
        <section className="hero">
          <button type="button" className="hero-search-btn">
            Buscar
          </button>

          <h2 className="hero-kicker">Consulta Veicular Inteligente</h2>

          <h1 className="hero-title">Descubra Tudo Sobre Seu Veículo</h1>

          <p className="hero-text">
            Consulta completa de dados veiculares, especificações técnicas e
            informações de manutenção em segundos.
          </p>

          <p className="hero-alert">
            Busca manual temporariamente indisponível. Use a busca por placa.
          </p>
        </section>

        {/* SEÇÃO “POR QUE ESCOLHER A TUREGGON?” */}
        <section className="why">
          <h3 className="why-title">Por que escolher a Tureggon?</h3>

          <div className="why-grid">
            <div className="why-item">
              <h4 className="why-item-title">Base Completa</h4>
              <p className="why-item-text">
                Milhares de veículos nacionais e importados em nossa base de
                dados atualizada.
              </p>
            </div>

            <div className="why-item">
              <h4 className="why-item-title">Consulta Rápida</h4>
              <p className="why-item-text">
                Resultados em segundos. Digite a placa e tenha todas as
                informações na tela.
              </p>
            </div>

            <div className="why-item">
              <h4 className="why-item-title">Dados Seguros</h4>
              <p className="why-item-text">
                Informações confiáveis e atualizadas com total segurança e
                privacidade.
              </p>
            </div>
          </div>
        </section>

        {/* RODAPÉ IGUAL AO DA LASY */}
        <footer className="footer">
          {/* Se você tiver a logo em /logo.png, pode trocar o texto por <img src="/logo.png" alt="Tureggon" /> */}
          <div className="footer-logo">Tureggon</div>

          <div className="footer-status">Sistema Online e Operacional</div>

          <div className="footer-copy">
            © 2024 Tureggon. Todos os direitos reservados.
          </div>

          <div className="footer-sub">
            Consulta veicular inteligente e segura
          </div>
        </footer>
      </main>

      {/* CSS: replicando o layout da página da Lasy */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          max-width: 960px;
          margin: 0 auto;
          padding: 32px 16px 48px;
          color: #ffffff;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
          /* não mexo no background aqui pra aproveitar o degradê que já existe no body do seu site */
        }

        /* TOPO */
        .top-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          text-align: center;
        }

        @media (min-width: 768px) {
          .top-bar {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }

        .brand-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .brand-logo {
          font-weight: 700;
          font-size: 20px;
        }

        .brand-status {
          font-size: 12px;
          opacity: 0.85;
        }

        .nav {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .nav-btn {
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          padding: 6px 14px;
          font-size: 12px;
          background: rgba(0, 0, 0, 0.18);
          color: #ffffff;
          cursor: pointer;
        }

        .nav-btn-secondary {
          border-color: rgba(255, 255, 255, 0.35);
          background: rgba(0, 0, 0, 0.1);
        }

        /* HERO */
        .hero {
          text-align: center;
          margin-bottom: 40px;
        }

        .hero-search-btn {
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 999px;
          padding: 6px 20px;
          background: rgba(0, 0, 0, 0.2);
          color: #ffffff;
          font-size: 13px;
          cursor: pointer;
          margin-bottom: 14px;
        }

        .hero-kicker {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 6px 0;
        }

        .hero-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 10px 0;
        }

        .hero-text {
          margin: 0 0 8px 0;
          font-size: 14px;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-alert {
          margin: 0;
          font-size: 13px;
          opacity: 0.9;
        }

        /* POR QUE ESCOLHER A TUREGGON */
        .why {
          text-align: center;
          margin-bottom: 40px;
        }

        .why-title {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 600;
        }

        .why-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 16px;
          text-align: left;
        }

        @media (min-width: 768px) {
          .why-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .why-item {
          background: rgba(0, 0, 0, 0.18);
          border-radius: 8px;
          padding: 12px 14px;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .why-item-title {
          margin: 0 0 4px 0;
          font-size: 15px;
          font-weight: 600;
        }

        .why-item-text {
          margin: 0;
          font-size: 13px;
        }

        /* RODAPÉ */
        .footer {
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding-top: 16px;
          font-size: 12px;
        }

        .footer-logo {
          font-weight: 700;
          margin-bottom: 4px;
        }

        .footer-status {
          margin-bottom: 4px;
        }

        .footer-copy {
          margin-bottom: 2px;
          opacity: 0.9;
        }

        .footer-sub {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
}
