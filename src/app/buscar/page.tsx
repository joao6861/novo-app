"use client";

import { useState } from "react";

export default function BuscarSemPlacaPage() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engine, setEngine] = useState("");

  const handleSearch = () => {
    alert(`Marca: ${brand} | Modelo: ${model} | Ano: ${year} | Motor: ${engine}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#001428] text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Buscar Sem Placa
      </h1>

      <div className="max-w-xl mx-auto space-y-4">

        <select
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">Selecione a marca</option>
          <option value="FIAT">FIAT</option>
          <option value="GM">GM</option>
          <option value="HYUNDAI">HYUNDAI</option>
        </select>

        <select
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="">Selecione o modelo</option>
        </select>

        <select
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Ano</option>
        </select>

        <select
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
          onChange={(e) => setEngine(e.target.value)}
        >
          <option value="">Motor</option>
        </select>

        <button
          onClick={handleSearch}
          className="w-full p-4 bg-blue-500 hover:bg-blue-600 rounded-xl"
        >
          Buscar Veículo
        </button>
      </div>
    </div>
  );
}
