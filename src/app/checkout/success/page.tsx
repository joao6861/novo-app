"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { AppFooter } from "@/components/layout/AppFooter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutSuccessPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-premium-dark pb-32 flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="max-w-xl space-y-8 animate-in slide-in-from-bottom-6 fade-in duration-700">
                    <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-primary/20 blob-animation">
                        <CheckCircle2 className="h-20 w-20 text-primary drop-shadow-[0_0_15px_rgba(48,255,0,0.5)]" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-tight text-white uppercase sm:text-5xl">
                            Pedido <span className="text-primary italic">Confirmado!</span>
                        </h1>
                        <p className="text-lg text-slate-400">
                            Muito obrigado por escolher a Tureggon Elite Store. Seu projeto acaba de subir de nível.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Package className="h-6 w-6 text-slate-400" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Status do Pedido</h2>
                        </div>
                        <p className="text-sm text-slate-400">
                            O número do seu pedido é <span className="text-white font-bold">#TRG-88192X</span>.
                            Enviamos os detalhes da compra e o link de rastreio para o seu e-mail.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-white/10">
                        <Button
                            onClick={() => router.push('/shop')}
                            className="h-14 rounded-xl bg-primary text-black font-black uppercase tracking-[0.1em] text-sm sm:w-64 hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
                        >
                            Continuar Comprando
                        </Button>
                        <Link href="/">
                            <Button
                                variant="outline"
                                className="h-14 w-full sm:w-64 rounded-xl border-white/10 bg-transparent text-white font-bold uppercase tracking-widest hover:bg-white/5 hover:text-primary transition-colors"
                            >
                                Voltar à Home <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <AppFooter />
        </div>
    );
}
