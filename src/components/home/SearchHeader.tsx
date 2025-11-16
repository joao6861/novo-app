"use client";

import { useState } from "react";
import { Search, MapPin, List } from "lucide-react";

export default function SearchHeader() {
  const [mode, setMode] = useState<"placa" | "manual" | "oficinas">("placa");
  const [placa, setPlaca] = useState("");

  return (
    <div className="w-full bg-[#00BFFF] py-4 px-4 flex flex-col gap-4 shadow-md rounded-b-3xl">
      {/* TOP BUTTONS */}
      <div className="flex gap-3 w-full">
        <button
          onClick={() => setMode("placa")}
          className={`flex items-center justify-center w-full h-12 rounded-xl font-medium 
          ${mode === "placa" ? "bg-white text-black" : "bg-white/40 text-white"}`}
        >
          <Search className="mr-2" size={18} />
          Buscar por Placa
        </button>

        <button
          onClick={() => setMode("manual")}
          className={`flex items-center justify-center w-full h-12 rounded-xl font-medium
          ${mode === "manual" ? "bg-white text-black" : "bg-white/40 text-white"}`}
        >
          <List className="mr-2" size={18} />
          Buscar sem Placa
        </button>

        <button
          onClick={() => setMode("oficinas")}
          className={`flex items-center justify-center w-full h-12 rounded-xl font-medium
          ${mode === "oficinas" ? "bg-white text-black" : "bg-white/40 text-white"}`}
        >
          <MapPin className="mr-2" size={18} />
          Oficinas Próximas
        </button>
      </div>

      {/* INPUT PLACA */}
      {mode === "placa" && (
        <div className="flex gap-3 w-full">
          <input
            type="text"
            value={placa}
            onChange={(e) => setPlaca(e.target.value.toUpperCase())}
            className="w-full h-12 rounded-xl bg-white text-black px-4 font-medium"
            placeholder="Digite a placa (ex: ABC1234)"
            maxLength={7}
          />

          <button className="bg-white rounded-xl h-12 px-6 flex items-center justify-center font-semibold text-black hover:bg-gray-200">
            <Search size={20} />
            <span className="ml-2">Buscar</span>
          </button>
        </div>
      )}

      {/* MODO MANUAL — CAMPOS */}
      {mode === "manual" && (
        <div className="text-center text-white text-sm mt-2">
          Busca manual está temporariamente indisponível. Use a busca por placa.
        </div>
      )}

      {/* MODO OFICINAS */}
      {mode === "oficinas" && (
        <div className="text-center text-white text-sm mt-2">
          Mostrando oficinas perto de você…
        </div>
      )}
    </div>
  );
}
