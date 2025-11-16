"use client";

export default function Home() {
  return (
    <>
      <main className="page">
        <div className="container">
          {/* Cabeçalho */}
          <header className="header">
            <div className="badge">
              <span className="badge-brand">TUREGGON</span>
              <span className="badge-text">SISTEMA ONLINE</span>
            </div>

            <h1 className="title">Consulta de veículos</h1>
            <p className="subtitle">
              Escolha uma opção abaixo para iniciar sua consulta.
            </p>
          </header>

          {/* Faixa clara com opções */}
          <section className="card">
            <div className="options">
              {/* OPÇÃO 1 */}
              <button
                type="button"
                className="option option-1"
                onClick={() =>
                  alert("Em breve: busca por PLACA integrada 🚗")
                }
              >
                <span className="option-tag">OPÇÃO 1</span>
                <span className="option-title">Buscar por placa</span>
                <span className="option-text">
                  Digite a placa para puxar os dados do veículo.
                </span>
              </button>

              {/* OPÇÃO 2 */}
              <button
                type="button"
                className="option"
                onClick={() =>
                  alert("Em breve: busca por modelo/ano sem placa 🔍")
                }
              >
                <span className="option-tag">OPÇÃO 2</span>
                <span className="option-title">Buscar sem placa</span>
                <span className="option-text">
                  Selecione marca, modelo, ano e motorização.
                </span>
              </button>

              {/* OPÇÃO 3 */}
              <button
                type="button"
                className="option option-3"
                onClick={() =>
                  alert("Em breve: mapa de oficinas parceiras Tureggon 📍")
                }
              >
                <span className="option-tag">OPÇÃO 3</span>
                <span className="option-title">Oficinas próximas</span>
                <span className="option-text">
                  Veja as oficinas parceiras mais perto de você.
                </span>
              </button>
            </div>
          </section>

          {/* Rodapé */}
          <p className="footer">
            Esta é uma versão de apresentação. Depois conectamos às consultas
            reais (Auto Óleo / banco de dados).
          </p>
        </div>
      </main>

      {/* CSS ESPECÍFICO DA PÁGINA */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 80px 16px;
          background: linear-gradient(180deg, #00b5ff 0%, #0085ff 100%);
          color: #ffffff;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
        }

        .container {
          width: 100%;
          max-width: 1100px;
          text-align: center;
        }

        .header {
          margin-bottom: 24px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          background: rgba(0, 0, 0, 0.2);
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .badge-brand {
          font-weight: 700;
        }

        .badge-text {
          opacity: 0.8;
        }

        .title {
          margin: 16px 0 4px 0;
          font-size: 32px;
          font-weight: 700;
        }

        .subtitle {
          margin: 0;
          font-size: 14px;
        }

        .card {
          margin-top: 24px;
          background: #e9e9e9;
          padding: 20px 24px;
        }

        .options {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          text-align: left;
        }

        .option {
          border: 1px solid #c4c4c4;
          border-radius: 4px;
          padding: 10px 12px;
          background: #f5f5f5;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: #111111;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
        }

        .option-1 {
          border-color: #007bff;
        }

        .option-3 {
          border-color: #00b894;
        }

        .option:hover {
          background: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .option-tag {
          font-size: 11px;
          font-weight: 600;
        }

        .option-title {
          font-size: 14px;
          font-weight: 600;
        }

        .option-text {
          font-size: 12px;
        }

        .footer {
          margin-top: 16px;
          font-size: 12px;
        }

        /* Responsivo (celular) */
        @media (max-width: 768px) {
          .page {
            padding-top: 40px;
          }

          .options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
