"use client";

import Link from "next/link";
import { MapPin, Search, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchHeader() {
  const router = useRouter();
  const [active, setActive] = useState("placa");

  return (
    <header className="w-full bg-[#02C4FF] shadow-lg">
      
      {/* CONTAINER CENTRAL */}
      <div className="max-w-[1400px] mx-auto px-6 py-4">

        {/* LINHA SUPERIOR COM LOGO + SISTEMA */}
        <div className="w-full flex items-center justify-between mb-4">
          <Link href="https://tureggon.com/" target="_blank">
            <img src="/logo.png" alt="Tureggon" className="h-12 cursor-pointer" />
          </Link>

          <button className="bg-white text-black px-5 py-2 rounded-xl font-semibold shadow hover:bg-gray-200">
            Sistema Online
          </button>
        </div>

        {/* BOTÕES (IGUAL LASY) */}
        <div className="flex gap-3">

          <button
            onClick={() => { setActive("placa"); router.push("/"); }}
            className={`px-5 py-3 rounded-xl border bg-white font-medium flex items-center gap-2
              ${active === "placa" ? "text-[#0091FF] border-[#0091FF]" : "text-black border-white"}`}
          >
            <Search size={18} />
            Buscar por Placa
          </button>

          <button
            onClick={() => { setActive("manual"); router.push("/buscar"); }}
            className={`px-5 py-3 rounded-xl border bg-white font-medium flex items-center gap-2
              ${active === "manual" ? "text-[#0091FF] border-[#0091FF]" : "text-black border-white"}`}
          >
            <List size={18} />
            Buscar sem Placa
          </button>

          <button
            onClick={() => router.push("/oficinas")}
            className={`px-5 py-3 rounded-xl border bg-white font-medium flex items-center gap-2
              ${active === "oficinas" ? "text-[#0091FF] border-[#0091FF]" : "text-black border-white"}`}
          >
            <MapPin size={18} />
            Oficinas Próximas
          </button>

        </div>
      </div>
    </header>
  );
}
