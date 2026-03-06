"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Lock,
    Truck,
    Loader2,
    ShoppingBag,
    ArrowLeft
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        nome: "",
        email: "",
        cpf: "",
        tel: "",
        cep: "",
        endereco: "",
        numero: "",
        complemento: "",
        cidade: "",
        estado: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;
        setLoading(true);

        try {
            const res = await fetch("/api/mercadopago", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart.map((item) => ({
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        image: item.image,
                    })),
                    payer: {
                        name: form.nome,
                        email: form.email,
                        cpf: form.cpf,
                        phone: form.tel.replace(/\D/g, ""),
                        cep: form.cep,
                        endereco: form.endereco,
                        numero: form.numero,
                    },
                    external_reference: `TRG-${Date.now()}`,
                }),
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                toast.error(data.error || "Erro ao criar pagamento. Tente novamente.");
                return;
            }

            // Redirecionar para o Checkout Pro do Mercado Pago
            window.location.href = data.init_point;
        } catch (err) {
            console.error(err);
            toast.error("Falha na conexão com o Mercado Pago. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-premium-dark flex flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center gap-6 p-4 text-center">
                    <ShoppingBag className="h-16 w-16 text-slate-600" />
                    <h2 className="text-2xl font-black text-white uppercase">Carrinho vazio</h2>
                    <Link href="/shop">
                        <Button className="bg-primary text-black font-black uppercase tracking-widest">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Ir para a loja
                        </Button>
                    </Link>
                </main>
            </div>
        );
    }

    const totalComDesconto = totalPrice * 0.95;

    return (
        <div className="min-h-screen bg-premium-dark pb-32">
            <Navbar />

            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-black tracking-tight text-white uppercase mb-12">
                    Finalizar <span className="text-gradient">Pedido</span>
                </h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* ── Formulário Entrega ── */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black font-black">1</div>
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Informações de Entrega</h2>
                            </div>

                            <Card className="border border-white/8 bg-white/5 backdrop-blur-sm shadow-xl p-6 space-y-4">
                                <CardContent className="p-0 space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <Field id="nome" label="Nome Completo" placeholder="Seu nome" value={form.nome} onChange={handleChange} required />
                                        <Field id="email" label="E-mail" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div className="sm:col-span-2">
                                            <Field id="cpf" label="CPF" placeholder="000.000.000-00" value={form.cpf} onChange={handleChange} required />
                                        </div>
                                        <Field id="tel" label="Telefone" placeholder="(41) 99999-9999" value={form.tel} onChange={handleChange} required />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                                        <Field id="cep" label="CEP" placeholder="00000-000" value={form.cep} onChange={handleChange} required />
                                        <div className="sm:col-span-3">
                                            <Field id="endereco" label="Endereço" placeholder="Rua, Avenida, Travessa..." value={form.endereco} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <Field id="numero" label="Número" placeholder="123" value={form.numero} onChange={handleChange} required />
                                        <div className="sm:col-span-2">
                                            <Field id="complemento" label="Complemento" placeholder="Apto, Sala..." value={form.complemento} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div className="sm:col-span-2">
                                            <Field id="cidade" label="Cidade" placeholder="Sua cidade" value={form.cidade} onChange={handleChange} required />
                                        </div>
                                        <Field id="estado" label="Estado (UF)" placeholder="PR" value={form.estado} onChange={handleChange} required />
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* ── Informação Mercado Pago ── */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black font-black">2</div>
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Pagamento via Mercado Pago</h2>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                {/* Logo MP */}
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#009ee3] shadow-lg shadow-[#009ee3]/20">
                                    <span className="text-white font-black text-lg">MP</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-white text-lg uppercase tracking-tight">Checkout Pro</p>
                                    <p className="text-sm text-slate-400 mt-1">
                                        Após confirmar, você será redirecionado para o ambiente seguro do Mercado Pago onde poderá pagar com:
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {["Pix (5% OFF)", "Cartão de Crédito", "Débito", "Boleto"].map((m) => (
                                            <span key={m} className="text-[10px] font-black uppercase tracking-widest bg-white/10 border border-white/10 text-slate-300 rounded-lg px-2 py-1">
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 shrink-0">
                                    <Lock className="h-3 w-3 text-primary" />
                                    100% Seguro
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* ── Sidebar Resumo ── */}
                    <div>
                        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl p-6 sticky top-28">
                            <CardContent className="p-0 space-y-6">
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">Seu Pedido</h2>

                                <div className="max-h-60 overflow-y-auto pr-1 space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-slate-900 border border-white/5">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-white truncate">{item.name}</p>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                                    {item.quantity}x R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                            <p className="text-sm font-black text-white shrink-0">
                                                R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">Subtotal</span>
                                        <span className="text-white">R$ {totalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">Desconto Pix</span>
                                        <span className="text-primary">- R$ {(totalPrice * 0.05).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">Frete</span>
                                        <span className="text-primary">{totalPrice >= 499 ? "Grátis" : "A calcular"}</span>
                                    </div>
                                    <Separator className="bg-white/10" />
                                    <div className="flex justify-between items-baseline pt-2">
                                        <span className="text-lg font-black text-white uppercase">Total (Pix)</span>
                                        <span className="text-3xl font-black text-primary">
                                            R$ {totalComDesconto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 mt-4 rounded-xl bg-[#009ee3] hover:bg-[#007bbf] text-white font-black uppercase tracking-[0.1em] text-sm shadow-lg shadow-[#009ee3]/30 transition-all hover:scale-[1.02]"
                                >
                                    {loading ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...</>
                                    ) : (
                                        <>Ir para o Pagamento →</>
                                    )}
                                </Button>

                                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                                    <Lock className="h-3 w-3" /> Ambiente seguro Mercado Pago
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </main>
        </div>
    );
}

function Field({
    id, label, placeholder, type = "text", value, onChange, required = false
}: {
    id: string; label: string; placeholder: string; type?: string;
    value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-xs font-black uppercase tracking-widest text-slate-500">{label}</Label>
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-primary focus:ring-primary"
            />
        </div>
    );
}
