"use client";

import Link from "next/link";
import { MapPin, Search, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchHeader() {
  const router = useRouter();
  const [active, setActive] = useState("placa");

  return (
    <header className="w-full bg-[#02C4FF] shadow-md">
      <div className="max-w-[1400px] mx-auto px-6 py-6">

        {/* TOP */}
        <div className="flex items-center justify-between mb-6">
          <Link href="https://tureggon.com/" target="_blank">
            <img src="/logo.png" alt="logo" className="h-12 cursor-pointer" />
          </Link>

          <button className="bg-white text-black px-5 py-2 rounded-xl shadow font-semibold">
            Sistema Online
          </button>
        </div>

        {/* BOTOES */}
        <div className="flex gap-3">
          <button
            onClick={() => { setActive("placa"); router.push("/"); }}
            className={`px-6 py-3 rounded-xl border bg-white flex items-center gap-2 font-medium
              ${active === "placa" ? "text-[#0091FF] border-[#0091FF]" : "text-black border-white"}`}
          >
            <Search size={18} />
            Buscar por Placa
          </button>

          <button
            onClick={() => { setActive("manual"); router.push("/buscar-sem-placa"); }}
            className={`px-6 py-3 rounded-xl border bg-white flex items-center gap-2 font-medium
              ${active === "manual" ? "text-[#0091FF] border-[#0091FF]" : "text-black border-white"}`}
          >
            <List size={18} />
            Buscar sem Placa
          </button>

          <button
            onClick={() => router.push("/oficinas")}
            className={`px-6 py-3 rounded-xl border bg-white flex items-center gap-2 font-medium
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
