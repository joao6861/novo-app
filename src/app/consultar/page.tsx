"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function ConsultarPage() {
  const [plate, setPlate] = useState("");

  const handleSearch = () => {
    if (!plate) return alert("Digite a placa");
    alert(`Buscando placa: ${plate}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#001428] text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Consulta por Placa
      </h1>

      <div className="max-w-xl mx-auto space-y-4">
        <input
          type="text"
          value={plate}
          onChange={(e) => setPlate(e.target.value.toUpperCase())}
          placeholder="Digite a placa (ex: ABC1D23)"
          className="w-full p-4 rounded-xl bg-white/10 outline-none border border-white/20"
        />

        <button
          onClick={handleSearch}
          className="w-full p-4 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center justify-center gap-2"
        >
          <Search size={20} /> Buscar Veículo
        </button>
      </div>
    </div>
  );
}
