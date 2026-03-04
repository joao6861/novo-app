"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ArrowRight, Printer } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
    const orderNumber = Math.floor(Math.random() * 900000) + 100000;

    return (
        <div className="min-h-screen bg-premium-dark flex flex-col">
            <Navbar />

            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
                    <div className="bg-primary/10 h-32 w-32 rounded-full flex items-center justify-center mx-auto border border-primary/20 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                        <CheckCircle2 className="h-16 w-16 text-primary" />
                    </div>

                    <div className="space-y-4">
                        <Badge className="bg-primary/20 text-primary border-none text-xs uppercase font-black px-4 py-1">Pagamento Aprovado</Badge>
                        <h1 className="text-4xl font-black tracking-tight text-white lg:text-6xl uppercase italic">Muito Obrigado!</h1>
                        <p className="text-slate-400 text-lg">Seu pedido <span className="text-white font-black">#TRG-{orderNumber}</span> foi recebido com sucesso.</p>
                    </div>

                    <div className="glass-premium p-8 rounded-3xl border-white/5 space-y-6 text-left">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" /> Próximos Passos
                        </h2>

                        <ul className="space-y-4">
                            <StepItem
                                title="Confirmação por E-mail"
                                desc="Enviamos todos os detalhes do seu pedido para o seu e-mail cadastrado."
                            />
                            <StepItem
                                title="Preparação"
                                desc="Nossa equipe já está separando suas peças em nosso centro de distribuição."
                            />
                            <StepItem
                                title="Envio Elite"
                                desc="Assim que o pedido for postado, você receberá o código de rastreio via WhatsApp."
                            />
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/shop" className="w-full sm:w-auto">
                            <Button className="h-14 px-10 w-full rounded-2xl bg-primary text-black font-black uppercase tracking-widest transition-transform hover:scale-105">
                                Voltar à Loja <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button variant="outline" className="h-14 px-10 w-full sm:w-auto rounded-2xl border-white/10 bg-white/5 text-white font-black uppercase tracking-widest backdrop-blur-sm hover:bg-white/10">
                            <Printer className="mr-2 h-5 w-5" /> Imprimir Comprovante
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StepItem({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            <div>
                <h3 className="font-bold text-white uppercase text-sm">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
            </div>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={`inline-flex items-center justify-center rounded-full ${className}`}>
            {children}
        </span>
    );
}
