"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { toast } from "sonner";

export function Newsletter() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Obrigado por assinar! Você receberá ofertas exclusivas.");
        (e.target as HTMLFormElement).reset();
    };

    return (
        <section className="relative overflow-hidden py-24 px-4">
            {/* Background Decor */}
            <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-primary/10 blur-[100px]"></div>
            <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-accent/10 blur-[100px]"></div>

            <div className="container mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 md:p-16 backdrop-blur-3xl text-center">
                <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Send className="h-6 w-6" />
                </div>

                <h2 className="mb-4 text-3xl font-black uppercase tracking-tighter md:text-5xl">
                    Ofertas <span className="text-primary italic">Exclusivas</span>
                </h2>
                <p className="mx-auto mb-10 max-w-xl text-lg text-white/60">
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

                <p className="mt-6 text-[10px] uppercase tracking-widest text-white/30">
                    Ao se cadastrar você aceita nossos termos de uso e privacidade.
                </p>
            </div>
        </section>
    );
}
