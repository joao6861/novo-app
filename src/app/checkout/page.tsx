"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
    CreditCard,
    MapPin,
    Lock,
    ChevronRight,
    Truck,
    CreditCard as PixIcon
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("pix");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulating order processing
        setTimeout(() => {
            setLoading(false);
            toast.success("Pedido realizado com sucesso!");
            clearCart();
            router.push("/checkout/success");
        }, 2000);
    };

    if (cart.length === 0) {
        if (typeof window !== "undefined") {
            router.push("/shop");
        }
        return null;
    }

    return (
        <div className="min-h-screen bg-premium-dark pb-32">
            <Navbar />

            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-black tracking-tight text-white uppercase mb-12">
                    Finalizar <span className="text-gradient">Pedido</span>
                </h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Main Form Fields */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping Info */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black font-black">1</div>
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Informações de Entrega</h2>
                            </div>

                            <Card className="glass border-none p-6 space-y-4 shadow-xl">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nome" className="text-xs font-black uppercase tracking-widest text-slate-500">Nome Completo</Label>
                                        <Input id="nome" placeholder="Seu nome" className="border-white/10 bg-white/5 text-white" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-500">E-mail</Label>
                                        <Input id="email" type="email" placeholder="seu@email.com" className="border-white/10 bg-white/5 text-white" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="sm:col-span-2 space-y-2">
                                        <Label htmlFor="cpf" className="text-xs font-black uppercase tracking-widest text-slate-500">CPF</Label>
                                        <Input id="cpf" placeholder="000.000.000-00" className="border-white/10 bg-white/5 text-white" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tel" className="text-xs font-black uppercase tracking-widest text-slate-500">Telefone</Label>
                                        <Input id="tel" placeholder="(00) 00000-0000" className="border-white/10 bg-white/5 text-white" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                                    <div className="sm:col-span-1 space-y-2">
                                        <Label htmlFor="cep" className="text-xs font-black uppercase tracking-widest text-slate-500">CEP</Label>
                                        <Input id="cep" placeholder="00000-000" className="border-white/10 bg-white/5 text-white" required />
                                    </div>
                                    <div className="sm:col-span-3 space-y-2">
                                        <Label htmlFor="end" className="text-xs font-black uppercase tracking-widest text-slate-500">Endereço</Label>
                                        <Input id="end" placeholder="Rua, Avenida, Travessa..." className="border-white/10 bg-white/5 text-white" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="num" className="text-xs font-black uppercase tracking-widest text-slate-500">Número</Label>
                                        <Input id="num" placeholder="123" className="border-white/10 bg-white/5 text-white" required />
                                    </div>
                                    <div className="sm:col-span-2 space-y-2">
                                        <Label htmlFor="comp" className="text-xs font-black uppercase tracking-widest text-slate-500">Complemento</Label>
                                        <Input id="comp" placeholder="Apto, Sala, Bloco..." className="border-white/10 bg-white/5 text-white" />
                                    </div>
                                </div>
                            </Card>
                        </section>

                        {/* Payment Info */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black font-black">2</div>
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Método de Pagamento</h2>
                            </div>

                            <Card className="glass border-none p-6 shadow-xl">
                                <RadioGroup defaultValue="pix" value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                                    <div className={`flex flex-col rounded-xl border transition-colors ${paymentMethod === 'pix' ? 'border-primary/50 bg-white/10' : 'border-white/5 bg-white/5 hover:border-primary/30'} p-4`}>
                                        <div className="flex items-center space-x-4">
                                            <RadioGroupItem value="pix" id="pix" className="border-white/20 text-primary" />
                                            <Label htmlFor="pix" className="flex flex-1 items-center justify-between cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <PixIcon className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <p className="font-bold text-white uppercase tracking-tight">Pix (5% de Desconto)</p>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Liberação instantânea</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-primary/20 text-primary border-none text-[10px] uppercase font-black px-2 py-0.5 rounded">Melhor Opção</Badge>
                                            </Label>
                                        </div>
                                    </div>

                                    <div className={`flex flex-col rounded-xl border transition-colors ${paymentMethod === 'card' ? 'border-primary/50 bg-white/10' : 'border-white/5 bg-white/5 hover:border-primary/30'} p-4`}>
                                        <div className="flex items-center space-x-4">
                                            <RadioGroupItem value="card" id="card" className="border-white/20 text-primary" />
                                            <Label htmlFor="card" className="flex flex-1 items-center justify-between cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <CreditCard className={`h-5 w-5 ${paymentMethod === 'card' ? 'text-primary' : 'text-slate-400'}`} />
                                                    <div>
                                                        <p className="font-bold text-white uppercase tracking-tight">Cartão de Crédito</p>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Até 10x sem juros</p>
                                                    </div>
                                                </div>
                                            </Label>
                                        </div>

                                        {/* Dropdown Formulário Cartão de Crédito */}
                                        {paymentMethod === 'card' && (
                                            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 gap-4 sm:grid-cols-2 animate-in slide-in-from-top-2 fade-in">
                                                <div className="sm:col-span-2 space-y-2">
                                                    <Label htmlFor="cc-number" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Número do Cartão</Label>
                                                    <Input id="cc-number" placeholder="0000 0000 0000 0000" className="border-white/10 bg-black/20 text-white" required={paymentMethod === 'card'} />
                                                </div>
                                                <div className="sm:col-span-2 space-y-2">
                                                    <Label htmlFor="cc-name" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nome no Cartão</Label>
                                                    <Input id="cc-name" placeholder="Como impresso no cartão" className="border-white/10 bg-black/20 text-white uppercase" required={paymentMethod === 'card'} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="cc-exp" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Validade</Label>
                                                    <Input id="cc-exp" placeholder="MM/AA" className="border-white/10 bg-black/20 text-white" required={paymentMethod === 'card'} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="cc-cvv" className="text-[10px] font-black uppercase tracking-widest text-slate-500">CVV</Label>
                                                    <Input id="cc-cvv" type="password" placeholder="123" maxLength={4} className="border-white/10 bg-black/20 text-white" required={paymentMethod === 'card'} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </RadioGroup>
                            </Card>
                        </section>
                    </div>

                    {/* Sidebar Order Summary */}
                    <div className="space-y-6">
                        <Card className="glass-premium border-none p-6 shadow-2xl sticky top-28">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-6">Seu Pedido</h2>

                            <div className="max-h-60 overflow-y-auto pr-2 mb-6 space-y-4 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-slate-900 border border-white/5">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-center">
                                            <p className="text-xs font-bold text-white line-clamp-1">{item.name}</p>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                                {item.quantity}x R$ {item.price.toLocaleString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-white/5">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="text-white">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-500">Frete</span>
                                    <span className="text-primary uppercase">Grátis</span>
                                </div>
                                <Separator className="bg-white/5" />
                                <div className="flex justify-between items-baseline pt-2">
                                    <span className="text-lg font-black text-white uppercase tracking-tight">Total</span>
                                    <span className="text-3xl font-black text-primary">
                                        R$ {(totalPrice * 0.95).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 mt-8 rounded-xl bg-primary text-black font-black uppercase tracking-[0.1em] text-base shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                            >
                                {loading ? "PROCESSANDO..." : "CONFIRMAR PAGAMENTO"}
                            </Button>

                            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                                <Lock className="h-3 w-3" /> Transação Criptografada
                            </div>
                        </Card>
                    </div>
                </form>
            </main>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={`inline-flex items-center justify-center rounded px-2 py-0.5 ${className}`}>
            {children}
        </span>
    );
}
