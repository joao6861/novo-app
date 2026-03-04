"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export function Newsletter() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Obrigado por assinar! Você receberá ofertas exclusivas.");
        (e.target as HTMLFormElement).reset();
    };

    return (
        <section className="relative overflow-hidden py-32 px-4 bg-slate-900">
            {/* Background Gradient */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-slate-900 to-black opacity-90"></div>

            {/* Mascot Composition - High-Performance Stickers */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Bottom Left Turtle - Large Sticker */}
                <div className="absolute -bottom-10 -left-10 w-64 h-64 md:w-[450px] md:h-[450px] opacity-100 transition-transform hover:scale-105 duration-700 rotate-[15deg]">
                    <div className="relative w-full h-full p-4">
                        <Image
                            src="/turtle-mascot.png"
                            alt="John Player Turtle"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Top Right Turtle - Floating Label Style */}
                <div className="absolute top-0 -right-10 w-48 h-48 md:w-80 md:h-80 opacity-90 -rotate-12 transition-transform hover:-translate-y-6 duration-1000 z-20">
                    <div className="relative w-full h-full p-4">
                        <Image
                            src="/turtle-mascot.png"
                            alt="John Player Turtle"
                            fill
                            className="object-contain drop-shadow-[0_0_30px_rgba(48,255,0,0.4)]"
                        />
                    </div>
                </div>

                {/* Top Left (Small Profile) */}
                <div className="absolute top-10 left-1/4 w-24 h-24 md:w-32 md:h-32 opacity-40 rotate-[45deg] hidden md:block transition-all hover:opacity-100 duration-500">
                    <div className="relative w-full h-full">
                        <Image
                            src="/turtle-mascot.png"
                            alt="John Player Turtle"
                            fill
                            className="object-contain grayscale hover:grayscale-0"
                        />
                    </div>
                </div>
            </div>

            <div className="container relative z-10 mx-auto max-w-4xl rounded-[3rem] border border-white/10 bg-black/60 p-8 md:p-16 backdrop-blur-2xl text-center shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-[0_0_20px_rgba(48,255,0,0.2)] text-black">
                    <Send className="h-8 w-8" />
                </div>

                <h2 className="mb-4 text-4xl font-black uppercase tracking-tighter md:text-6xl text-white">
                    Ofertas <span className="text-primary italic">Exclusivas</span>
                </h2>
                <p className="mx-auto mb-10 max-w-xl text-lg text-slate-300 font-medium">
                    Junte-se ao time de elite da Tureggon e receba em primeira mão novidades sobre performance e estética automotiva técnica.
                </p>

                <div className="relative z-20">
                    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
                        <Input
                            placeholder="Seu melhor e-mail"
                            className="h-14 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary"
                            required
                            type="email"
                        />
                        <Button type="submit" className="h-14 px-10 rounded-xl font-black uppercase tracking-[0.2em] bg-primary hover:bg-primary/80 text-black shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                            Assinar
                        </Button>
                    </form>
                </div>

                <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                    Ao se cadastrar você aceita nossos termos de uso e privacidade.
                </p>
            </div>
        </section>
    );
}
