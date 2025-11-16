"use client";

import { useState } from "react";
import { Search, List, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchHeader() {
  const [activeTab, setActiveTab] = useState<"placa" | "manual" | "oficinas">("placa");
  const router = useRouter();

  return (
    <header className="w-full">
      <div className="bg-gradient-to-r from-[#00c0ff] to-[#0090ff] p-5 shadow-md">
        
        {/* TOP BAR */}
        <div className="max-w-6xl mx-auto flex items-center justify-between mb-6">

          {/* LOGO → redireciona para zureggon.com */}
          <a href="https://tureggon.com/" target="_blank">
            <img src="/logo.png" className="h-10 cursor-pointer" alt="Tureggon Store" />
          </a>

          <button className="border border-white text-white px-4 py-1 rounded-xl hover:bg-white hover:text-black transition">
            Sistema Online
          </button>
        </div>

        {/* TABS */}
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-3">

          {/* BUSCAR POR PLACA */}
          <button
            onClick={() => setActiveTab("placa")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow transition ${
              activeTab === "placa" ? "bg-white text-black" : "bg-[#ffffff40] text-white"
            }`}
          >
            <Search size={18} />
            Buscar por Placa
          </button>

          {/* BUSCAR SEM PLACA */}
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow transition ${
              activeTab === "manual" ? "bg-white text-black" : "bg-[#ffffff40] text-white"
            }`}
          >
            <List size={18} />
            Buscar sem Placa
          </button>

          {/* OFICINAS → agora navega para /oficinas */}
          <button
            onClick={() => router.push("/oficinas")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow transition ${
              activeTab === "oficinas" ? "bg-white text-black" : "bg-[#ffffff40] text-white"
            }`}
          >
            <MapPin size={18} />
            Oficinas Próximas
          </button>
        </div>

        {/* INPUT DE BUSCA */}
        <div className="max-w-6xl mx-auto mt-4 flex items-center gap-3">
          <input
            type="text"
            placeholder={
              activeTab === "placa"
                ? "Digite a placa (ex: ABC1234)"
                : "Digite marca, modelo ou detalhes"
            }
            className="flex-1 px-4 py-4 rounded-xl text-black shadow-md outline-none border border-gray-300"
          />

          <button className="flex items-center gap-2 bg-[#ffffff50] hover:bg-white text-white hover:text-black px-6 py-4 rounded-xl transition shadow">
            <Search />
            Buscar
          </button>
        </div>

        {/* FILTROS MANUAIS */}
        {activeTab === "manual" && (
          <div className="max-w-6xl mx-auto mt-4 grid grid-cols-4 gap-3">
            <select className="px-4 py-3 rounded-xl bg-white text-black shadow">
              <option>Marca</option>
            </select>

            <select className="px-4 py-3 rounded-xl bg-white text-black shadow">
              <option>Modelo</option>
            </select>

            <select className="px-4 py-3 rounded-xl bg-white text-black shadow">
              <option>Ano</option>
            </select>

            <select className="px-4 py-3 rounded-xl bg-white text-black shadow">
              <option>Motor</option>
            </select>
          </div>
        )}
      </div>
    </header>
  );
}
