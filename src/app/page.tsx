"use client";

import { useState } from "react";
import SearchHeader from "@/components/home/SearchHeader";
import HeroSection from "@/components/home/HeroSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import AppFooter from "@/components/layout/AppFooter";

export default function HomePage() {
  const [mode, setMode] = useState<"placa" | "manual" | "oficinas">("placa");

  return (
    <main className="min-h-screen bg-[#00B8FF] flex flex-col">
      {/* TOPO AZUL COM BUSCAS */}
      <SearchHeader mode={mode} onModeChange={setMode} />

      {/* PARTE DE BAIXO — GRADIENTE AZUL ESCURO */}
      <div className="flex-1 bg-gradient-to-b from-[#041C3A] to-[#020617] text-white pt-10 pb-16">
        {mode === "oficinas" ? (
        ) : (
          <>
            <HeroSection />
            <WhyChooseSection />
          </>
        )}

        <AppFooter />
      </div>
    </main>
  );
}
