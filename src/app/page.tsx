"use client";

import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-700 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 md:py-12">
        {/* TOPO – LOGO + SISTEMA ONLINE + MENU */}
        <header className="mb-10 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold tracking-tight">Tureggon</span>
            <span className="text-xs uppercase tracking-[0.2em] text-sky-100">
              Sistema Online
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              className="rounded-full border border-white/70 bg-black/20 px-4 py-1.5 text-xs font-medium hover:bg-black/30"
            >
              Buscar por Placa
            </button>
            <button
              type="button"
              className="rounded-full border border-white/40 bg-black/10 px-4 py-1.5 text-xs font-medium hover:bg-black/20"
            >
              Buscar sem Placa
            </button>
            <button
              type="button"
              className="rounded-full border border-white/40 bg-black/10 px-4 py-1.5 text-xs font-medium hover:bg-black/20"
            >
              Oficinas Próximas
            </button>
          </nav>
        </header>

        {/* CONTEÚDO PRINCIPAL / HERO */}
        <section className="mb-12 text-center">
          <button
            type="button"
            className="mb-4 rounded-full border border-white/70 bg-black/20 px-6 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-black/30"
          >
            Buscar
          </button>

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-50">
            Consulta Veicular Inteligente
          </p>

          <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
            Descubra Tudo Sobre Seu Veículo
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm md:text-base">
            Consulta completa de dados veiculares, especificações técnicas e
            informações de manutenção em segundos.
          </p>

          <p className="mx-auto mt-2 max-w-xl text-xs md:text-sm text-sky-100">
            Busca manual temporariamente indisponível. Use a busca por placa.
          </p>
        </section>

        {/* POR QUE ESCOLHER A TUREGGON */}
        <section className="mb-12">
          <h2 className="mb-5 text-center text-xl font-semibold md:text-2xl">
            Por que escolher a Tureggon?
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/25 bg-black/20 p-4">
              <h3 className="mb-1 text-sm font-semibold md:text-base">
                Base Completa
              </h3>
              <p className="text-xs md:text-sm text-sky-50">
                Milhares de veículos nacionais e importados em nossa base de
                dados atualizada.
              </p>
            </div>

            <div className="rounded-xl border border-white/25 bg-black/20 p-4">
              <h3 className="mb-1 text-sm font-semibold md:text-base">
                Consulta Rápida
              </h3>
              <p className="text-xs md:text-sm text-sky-50">
                Resultados em segundos. Digite a placa e tenha todas as
                informações na tela.
              </p>
            </div>

            <div className="rounded-xl border border-white/25 bg-black/20 p-4">
              <h3 className="mb-1 text-sm font-semibold md:text-base">
                Dados Seguros
              </h3>
              <p className="text-xs md:text-sm text-sky-50">
                Informações confiáveis e atualizadas com total segurança e
                privacidade.
              </p>
            </div>
          </div>
        </section>

        {/* RODAPÉ */}
        <footer className="mt-auto border-t border-white/25 pt-4 text-center text-xs md:text-sm">
          <div className="font-semibold">Tureggon</div>
          <div className="mt-1 text-[11px] md:text-xs">
            Sistema Online e Operacional
          </div>
          <div className="mt-1 text-[11px] md:text-xs text-sky-100">
            © 2024 Tureggon. Todos os direitos reservados.
          </div>
          <div className="mt-1 text-[11px] md:text-xs text-sky-100">
            Consulta veicular inteligente e segura
          </div>
        </footer>
      </div>
    </main>
  );
}
