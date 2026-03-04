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
        <section className="relative overflow-hidden py-32 px-4 bg-black">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                {/* Desktop Background */}
                <Image
                    src="/newsletter-bg.png"
                    alt="Newsletter Background Desktop"
                    fill
                    className="hidden md:block object-cover object-center opacity-40 grayscale"
                    priority
                />
                {/* Mobile Background */}
                <Image
                    src="/newsletter-bg-mobile.png"
                    alt="Newsletter Background Mobile"
                    fill
                    className="block md:hidden object-cover object-center opacity-50 grayscale"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80"></div>
            </div>

            <div className="container relative z-10 mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-black/40 p-8 md:p-16 backdrop-blur-xl text-center">
                <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Send className="h-6 w-6" />
                </div>

                <h2 className="mb-4 text-3xl font-black uppercase tracking-tighter md:text-5xl text-white">
                    Ofertas <span className="text-primary italic">Exclusivas</span>
                </h2>
                <p className="mx-auto mb-10 max-w-xl text-lg text-white/70">
                    Cadastre-se e seja o primeiro a receber novidades sobre peças de performance e cuidados automotivos.
                </p>

                <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                    <Input
                        placeholder="Seu melhor e-mail"
                        className="h-12 border-white/20 bg-white/5 text-white placeholder:text-white/30 focus:border-primary"
                        required
                        type="email"
                    />
                    <Button type="submit" className="h-12 px-8 font-bold uppercase tracking-widest bg-primary hover:bg-primary/80 text-black">
                        Assinar
                    </Button>
                </form>

                <p className="mt-6 text-[10px] uppercase tracking-widest text-white/40">
                    Ao se cadastrar você aceita nossos termos de uso e privacidade.
                </p>
            </div>
        </section>
    );
}
