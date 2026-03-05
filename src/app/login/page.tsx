"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppFooter } from "@/components/layout/AppFooter";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-premium-dark pb-32">
            <Navbar />
            <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-black tracking-tight text-white uppercase">
                            Sua <span className="text-gradient">Conta</span>
                        </h1>
                        <p className="mt-2 text-slate-400">Entre para gerenciar seus pedidos e veículos salvos.</p>
                    </div>

                    <Card className="glass border-none p-8 shadow-2xl">
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-500">E-mail</Label>
                                <Input id="email" type="email" placeholder="seu@email.com" className="border-white/10 bg-white/5 text-white" required />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-500">Senha</Label>
                                    <Link href="#" className="text-xs text-primary font-bold hover:underline">Esqueceu a senha?</Link>
                                </div>
                                <Input id="password" type="password" placeholder="••••••••" className="border-white/10 bg-white/5 text-white" required />
                            </div>

                            <Button type="button" className="w-full h-12 bg-primary text-black font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">
                                Entrar
                            </Button>

                            <div className="text-center text-sm text-slate-500 mt-6 pt-6 border-t border-white/10">
                                Novo na Tureggon? <Link href="#" className="text-white font-bold hover:text-primary transition-colors">Crie sua conta</Link>
                            </div>
                        </form>
                    </Card>
                </div>
            </main>
            <AppFooter />
        </div>
    );
}
