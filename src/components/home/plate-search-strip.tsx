"use client";

import React, { useState } from "react";
import { Search, Car, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PlateSearchStrip() {
    const [plate, setPlate] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!plate.trim()) return;
        setLoading(true);
        // Simulation of search logic
        setTimeout(() => {
            setLoading(false);
            console.log("Searching for plate:", plate);
        }, 1500);
    };

    return (
        <div className="w-full bg-white py-4">
            <div className="container mx-auto px-4">
                <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900 px-6 py-6 shadow-2xl md:px-8">
                    {/* Decorative background glow - softer for light mode */}
                    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl opacity-30" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        {/* Explanation text */}
                        <div className="max-w-xl">
                            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-primary">
                                <Info size={10} />
                                Tureggon Elite
                            </div>
                            <h3 className="text-xl font-black uppercase italic tracking-tight text-white md:text-2xl">
                                Busca Técnica por <span className="text-primary">Placa</span>
                            </h3>
                            <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-400 md:text-sm">
                                Identificação instantânea de peças compatíveis para performance e manutenção.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">
                                    • Dados Técnicos
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">
                                    • Especificações
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">
                                    • Compatibilidade
                                </span>
                            </div>
                        </div>

                        {/* Search Input Area */}
                        <div className="w-full lg:max-w-md">
                            <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center bg-white border border-slate-200 p-1.5 rounded-xl focus-within:border-primary/50 transition-all shadow-sm">
                                <div className="relative flex-1">
                                    <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="PLACA (EX: ABC1234)"
                                        className="h-11 w-full border-none bg-transparent pl-10 pr-4 text-base font-black uppercase tracking-widest text-black placeholder:text-black/60 outline-none focus:ring-0"
                                        value={plate}
                                        onChange={(e) => setPlate(e.target.value.toUpperCase())}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                </div>
                                <Button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="h-11 px-6 rounded-lg bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
                                            Buscando
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Search size={14} strokeWidth={3} />
                                            Consultar
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
