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
        <div className="w-full bg-premium-dark py-8">
            <div className="container mx-auto px-4">
                <div className="glass-premium relative overflow-hidden rounded-3xl border border-primary/20 p-6 md:p-8 shadow-[0_0_50px_-12px_rgba(0,145,255,0.3)]">
                    {/* Decorative background glow */}
                    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

                    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        {/* Explanation text */}
                        <div className="max-w-xl space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                                <Info size={12} />
                                Sistema Tureggon Elite
                            </div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tight text-white md:text-3xl">
                                Encontre Peças pela <span className="text-primary">Placa</span>
                            </h3>
                            <p className="text-sm font-medium leading-relaxed text-slate-400 md:text-base">
                                Nosso sistema avançado identifica as especificações técnicas exatas do seu veículo, garantindo 100% de compatibilidade em todas as peças de performance e manutenção.
                            </p>
                        </div>

                        {/* Search Input Area */}
                        <div className="w-full lg:max-w-md">
                            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center bg-black/40 border border-white/10 p-2 rounded-2xl focus-within:border-primary/50 transition-all shadow-inner">
                                <div className="relative flex-1">
                                    <Car className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="DIGITE A PLACA (EX: ABC1234)"
                                        className="h-14 w-full border-none bg-transparent pl-12 pr-4 text-lg font-black uppercase tracking-widest text-white placeholder:text-slate-700 outline-none focus:ring-0"
                                        value={plate}
                                        onChange={(e) => setPlate(e.target.value.toUpperCase())}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                </div>
                                <Button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                                            Buscando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Search size={18} strokeWidth={3} />
                                            Consultar
                                        </div>
                                    )}
                                </Button>
                            </div>
                            <p className="mt-3 text-center lg:text-left text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                                Acesso à base oficial de <span className="text-slate-400">5.4M+</span> veículos
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
