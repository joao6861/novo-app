"use client";

import React, { useState } from "react";
import { Search, Car, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlacaInfo, buscarVeiculosPorPlacaNaBase } from "@/lib/plate-utils";

export function HeroSection() {
    const [plate, setPlate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        const value = plate.trim().toUpperCase();
        if (!value) {
            setError("Digite a placa para consultar.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Simulando a chamada de API (a lógica real seria via fetch('/api/consulta-placa'))
            const res = await fetch("/api/consulta-placa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ placa: value }),
            });
            const data = await res.json();

            if (!res.ok || data.error) {
                setError(data.message || "Erro ao consultar a placa.");
                return;
            }

            // Se der certo, redirecionamos para o resultado ou fazemos algo com o dado
            console.log("Plate data:", data);
            // Aqui poderíamos emitir um evento ou setar um estado global
        } catch (e) {
            setError("Falha na conexão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative overflow-hidden bg-premium-dark py-24 lg:py-32">
            {/* Background Decor */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-[120px] opacity-20 pointer-events-none">
                <div className="h-[400px] w-[600px] bg-primary rounded-full" />
            </div>

            <div className="container relative z-10 mx-auto px-4 text-center">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                        <Zap className="h-4 w-4 text-primary fill-primary/20" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                            Encontre peças compatíveis instantaneamente
                        </span>
                    </div>

                    <h1 className="mb-6 text-5xl font-black tracking-tight text-white lg:text-7xl">
                        A Maior Loja de <br />
                        <span className="text-gradient">Auto Peças</span> do Brasil
                    </h1>

                    <p className="mb-10 text-lg leading-relaxed text-slate-400 lg:text-xl">
                        Peças de alta performance e manutenção para todos os veículos.
                        Entregamos em todo o território nacional com garantia e suporte especializado.
                    </p>

                    <div className="mx-auto mb-12 max-w-xl">
                        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center glass-premium p-2 rounded-2xl">
                            <div className="relative flex-1">
                                <Car className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                                <Input
                                    placeholder="DIGITE SUA PLACA (EX: ABC1D23)"
                                    className="h-14 border-none bg-transparent pl-12 text-lg font-bold uppercase tracking-widest placeholder:text-slate-600 focus-visible:ring-0"
                                    value={plate}
                                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                            </div>
                            <Button
                                onClick={handleSearch}
                                disabled={loading}
                                className="h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-black font-black text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                            >
                                {loading ? "BUSCANDO..." : "BUSCAR PEÇAS"}
                            </Button>
                        </div>
                        {error && (
                            <p className="mt-4 text-sm font-medium text-red-400 tracking-tight">
                                {error}
                            </p>
                        )}
                        <p className="mt-4 text-xs font-medium text-slate-500 uppercase tracking-widest">
                            Consultamos mais de <span className="text-slate-300">5 milhões</span> de veículos
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        <FeatureIcon text="Entrega Expressa" />
                        <FeatureIcon text="Peças Originais" />
                        <FeatureIcon text="Suporte 24/7" />
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeatureIcon({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-accent" />
            <span className="text-sm font-bold text-white/70 uppercase tracking-wider">
                {text}
            </span>
        </div>
    );
}
