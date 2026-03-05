"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Trash2,
    Minus,
    Plus,
    ArrowRight,
    ShoppingBag,
    ArrowLeft,
    ShieldCheck,
    Truck
} from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-premium-dark flex flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="text-center space-y-6">
                        <div className="bg-white/5 h-24 w-24 rounded-full flex items-center justify-center mx-auto border border-white/10">
                            <ShoppingBag className="h-10 w-10 text-slate-500" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-white uppercase">Seu carrinho está vazio</h1>
                        <p className="text-slate-500 max-w-xs mx-auto text-sm uppercase font-bold tracking-widest">
                            Explore nosso catálogo e encontre as melhores peças para seu veículo.
                        </p>
                        <Link href="/shop">
                            <Button className="h-12 px-8 rounded-xl bg-primary text-black font-black uppercase tracking-widest transition-transform hover:scale-105">
                                Ir para a loja
                            </Button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-premium-dark pb-24">
            <Navbar />

            <main className="container mx-auto px-4 py-12">
                <div className="mb-12 flex items-center justify-between">
                    <h1 className="text-4xl font-black tracking-tight text-white lg:text-5xl uppercase">
                        Meu <span className="text-gradient">Carrinho</span>
                    </h1>
                    <Badge className="bg-white/5 text-slate-400 border-white/10 rounded-lg px-3 py-1 text-sm font-bold">
                        {totalItems} ITENS
                    </Badge>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <Card key={item.id} className="glass overflow-hidden border-none shadow-xl">
                                <CardContent className="p-4 flex gap-6 sm:p-6">
                                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-900 border border-white/5 sm:h-32 sm:w-32">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                                                    {item.category || "Auto Peças"}
                                                </span>
                                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                                    {item.name}
                                                </h3>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap items-end justify-between gap-4">
                                            <div className="flex h-10 items-center gap-4 rounded-lg bg-white/5 border border-white/10 px-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="text-slate-400 hover:text-white transition-colors"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="min-w-[20px] text-center font-black text-white">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="text-slate-400 hover:text-white transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Subtotal</p>
                                                <p className="text-xl font-black text-white">
                                                    R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Link href="/shop" className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:opacity-80 transition-opacity">
                            <ArrowLeft className="h-4 w-4" /> Continuar Comprando
                        </Link>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="space-y-6">
                        <Card className="glass-premium border-none p-6 shadow-2xl sticky top-28">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-6">Resumo do Pedido</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="text-white">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                                    <span className="text-slate-500">Frete estimado</span>
                                    <span className="text-accent underline cursor-pointer">Calcular agora</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                                    <span className="text-slate-500">Desconto PIX</span>
                                    <span className="text-primary">- R$ {(totalPrice * 0.05).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>

                                <Separator className="bg-white/5" />

                                <div className="flex justify-between items-baseline py-2">
                                    <span className="text-lg font-black text-white uppercase tracking-tight">Total</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-white">
                                            R$ {(totalPrice * 0.95).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">No PIX já com desconto</p>
                                    </div>
                                </div>

                                <Link href="/checkout">
                                    <Button className="w-full h-14 mt-4 rounded-xl bg-primary text-black font-black uppercase tracking-[0.1em] text-base shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                                        Finalizar Compra <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>

                                <div className="pt-6 space-y-4">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-500">
                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                        Pagamento 100% Protegido
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-500">
                                        <Truck className="h-4 w-4 text-primary" />
                                        Enviamos para todo o Brasil
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={`inline-flex items-center justify-center ${className}`}>
            {children}
        </span>
    );
}
