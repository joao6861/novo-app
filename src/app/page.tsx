"use client";

import SearchHeader from "@/components/home/SearchHeader";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#02C4FF] via-[#0091FF] to-[#001F3F]">
      
      {/* CABEÇALHO E ÁREA DE BUSCA – IGUAL À LASY */}
      <SearchHeader />

      {/* ÁREA DE CONTEÚDO – COMO NA LASY (BRANCO E LIMPO) */}
      <div className="flex-1 w-full bg-white text-black rounded-t-3xl shadow-xl mt-6 p-6 max-w-[1400px] mx-auto">
        
        <h1 className="text-2xl font-bold text-[#0091FF]">
          Bem-vindo ao sistema Tureggon
        </h1>

        <p className="text-gray-600 mt-2">
          Aqui vão entrar suas informações, cards, categorias, etc — igual à segunda parte do layout da Lasy.
        </p>

      </div>
    </main>
  );
}
