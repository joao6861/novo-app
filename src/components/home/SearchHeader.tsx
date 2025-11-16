"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { useState } from "react";

export default function SearchHeader() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("placa");

  const handlePlateSearch = () => {
    if (!query) return;
    router.push(`/consulta?placa=${query}`);
  };

  return (
    <div className="w-full bg-transparent flex flex-col items-center pt-6 pb-8">

      {/* TOPO COM LOGO + BOTÃO SISTEMA */}
      <div className="w-full max-w-[1450px] flex justify-between items-center px-6 mb-6">
        <Link href="https://tureggon.com/">
          <img
            src="/logo.png"
            alt="Tureggon Store"
            className="h-12 cursor-pointer"
          />
        </Link>

        <Link
          href="/sistema"
          className="px-5 py-2 rounded-xl bg-white text-black font-medium shadow"
        >
          Sistema Online
        </Link>
      </div>

      {/* LINHA DOS BOTÕES */}
      <div className="w-full max-w-[1450px] flex items-center gap-4 px-6">
        
        {/* BOTOES MENU (branco com letra preta / azul ao ativo) */}
        <button
          onClick={() => setActive("placa")}
          className={`px-6 py-3 rounded-xl shadow text-sm font-medium border 
          ${active === "placa" ? "text-blue-600 bg-white" : "text-black bg-white"}`}
        >
          Buscar por Placa
        </button>

        <button
          onClick={() => setActive("manual")}
          className={`px-6 py-3 rounded-xl shadow text-sm font-medium border 
          ${active === "manual" ? "text-blue-600 bg-white" : "text-black bg-white"}`}
        >
          Buscar sem Placa
        </button>

        <button
          onClick={() => router.push("/oficinas")}
          className={`px-6 py-3 rounded-xl shadow text-sm font-medium border 
          ${active === "oficinas" ? "text-blue-600 bg-white" : "text-black bg-white"}`}
        >
          Oficinas Próximas
        </button>
      </div>

      {/* CAMPO DE BUSCA */}
      <div className="w-full max-w-[1450px] px-6 mt-4 flex gap-4">
        <div className="flex w-full bg-white/20 px-4 py-3 rounded-xl backdrop-blur-md border border-white/30">
          <Search className="mr-2" />
          <input
            className="bg-transparent outline-none w-full text-white placeholder-white"
            placeholder="Digite a placa (ex: ABC1234)"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
        </div>

        <button
          onClick={handlePlateSearch}
          className="bg-white text-black px-6 rounded-xl shadow flex items-center justify-center"
        >
          <Search size={20} />
        </button>
      </div>

      {/* SELECTS DE FILTRO */}
      <div className="w-full max-w-[1450px] px-6 mt-4 grid grid-cols-4 gap-4">
        <select className="bg-white text-black px-4 py-3 rounded-xl shadow">
          <option>Marca</option>
        </select>

        <select className="bg-white text-black px-4 py-3 rounded-xl shadow">
          <option>Modelo</option>
        </select>

        <select className="bg-white text-black px-4 py-3 rounded-xl shadow">
          <option>Ano</option>
        </select>

        <select className="bg-white text-black px-4 py-3 rounded-xl shadow">
          <option>Motor</option>
        </select>
      </div>

    </div>
  );
}
