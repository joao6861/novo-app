"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-900 via-sky-950 to-black text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Cabeçalho */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.2em]">
            <span className="font-semibold">Tureggon</span>
            <span className="opacity-70">Sistema Online</span>
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-bold">
            Consulta de veículos
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Escolha uma opção abaixo para iniciar sua consulta.
          </p>
        </header>

        {/* Card principal */}
        <section className="bg-slate-900/70 border border-slate-700/70 rounded-2xl shadow-2xl backdrop-blur-md p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Botão: Buscar por placa */}
            <button
              type="button"
              className="flex flex-col items-start justify-between gap-2 rounded-xl border border-sky-500/50 bg-sky-500/10 hover:bg-sky-500/20 transition-all px-4 py-3 text-left"
              onClick={() => {
                alert("Em breve: busca por PLACA integrada 🚗");
              }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-300">
                Opção 1
              </span>
              <span className="text-base font-semibold">
                Buscar por placa
              </span>
              <span className="text-xs text-slate-300">
                Digite a placa para puxar os dados do veículo.
              </span>
            </button>

            {/* Botão: Buscar sem placa */}
            <button
              type="button"
              className="flex flex-col items-start justify-between gap-2 rounded-xl border border-slate-700 bg-slate-800/70 hover:bg-slate-700/70 transition-all px-4 py-3 text-left"
              onClick={() => {
                alert("Em breve: busca por modelo/ano sem placa 🔍");
              }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-300">
                Opção 2
              </span>
              <span className="text-base font-semibold">
                Buscar sem placa
              </span>
              <span className="text-xs text-slate-300">
                Selecione marca, modelo, ano e motorização.
              </span>
            </button>

            {/* Botão: Oficinas próximas */}
            <button
              type="button"
              className="flex flex-col items-start justify-between gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all px-4 py-3 text-left"
              onClick={() => {
                alert("Em breve: mapa de oficinas parceiras Tureggon 📍");
              }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-300">
                Opção 3
              </span>
              <span className="text-base font-semibold">
                Oficinas próximas
              </span>
              <span className="text-xs text-slate-300">
                Veja as oficinas parceiras mais perto de você.
              </span>
            </button>
          </div>

          {/* Rodapé do card */}
          <div className="mt-6 text-xs text-slate-400 text-center">
            Esta é uma versão de apresentação. Depois conectamos às consultas
            reais (Auto Óleo / banco de dados).
          </div>
        </section>
      </div>
    </main>
  );
}
