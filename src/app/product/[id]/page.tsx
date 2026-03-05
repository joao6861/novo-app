"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ShoppingCart,
    ArrowLeft,
    Truck,
    RotateCcw,
    Star
} from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { AppFooter } from "@/components/layout/AppFooter";

// Mock Products (Sharing same data as Shop for consistency)
const ALL_PRODUCTS = [
    {
        id: 1,
        name: "Óleo 5W30 Castrol Magnatec",
        category: "Óleos e Fluidos",
        price: 349.90,
        image: "https://images.unsplash.com/photo-1594491959868-874b6e5f8f53?q=80&w=800&auto=format&fit=crop",
        brand: "Castrol",
        description: "Óleo lubrificante de tecnologia sintética que proporciona proteção instantânea desde o momento da partida.",
        specs: [
            { label: "Viscosidade", value: "5W30" },
            { label: "Volume", value: "1 Litro" },
            { label: "Norma", value: "API SP / ILSAC GF-6" },
        ],
    },
    {
        id: 2,
        name: "Pastilha de Freio Brembo",
        category: "Freios",
        price: 890.00,
        image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=800&auto=format&fit=crop",
        brand: "Brembo",
        description: "As pastilhas Brembo oferecem a melhor frenagem, conforto e durabilidade para seu veículo de alta performance.",
        specs: [
            { label: "Posição", value: "Dianteira" },
            { label: "Material", value: "Cerâmica" },
            { label: "Compatibilidade", value: "Linha Premium" },
        ],
    },
    // ... (Adding others for robustness)
];

export default function ProductDetails() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const product = ALL_PRODUCTS.find((p) => p.id === Number(id)) || ALL_PRODUCTS[0];

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    return (
        <div className="min-h-screen bg-white pb-24">
            <Navbar />

            <main className="container mx-auto px-4 py-12">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-8 gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                >
                    <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
                </Button>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Image Gallery Area */}
                    <div className="space-y-4">
                        <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-sm">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-slate-100 bg-white opacity-60 transition-opacity hover:opacity-100 cursor-pointer shadow-sm">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Area */}
                    <div className="flex flex-col">
                        <div className="mb-6 flex items-center justify-between">
                            <Badge className="bg-primary/20 text-primary border-none uppercase font-black tracking-widest text-[10px]">
                                {product.category}
                            </Badge>
                            <div className="flex items-center gap-1 text-accent">
                                <Star className="h-4 w-4 fill-accent" />
                                <span className="text-sm font-bold">4.9 (124 avaliações)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl font-black tracking-tight text-slate-950 lg:text-5xl">
                            {product.name}
                        </h1>
                        <p className="mt-4 text-xl font-bold text-slate-500 uppercase tracking-widest">
                            Ref: <span className="text-slate-400">TRG-{product.id}992X</span> • Marca: {product.brand}
                        </p>

                        <div className="my-8 h-px bg-slate-100" />

                        <div className="mb-10">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Preço à vista</span>
                            <div className="flex items-baseline gap-4 mt-2">
                                <span className="text-5xl font-black text-slate-950">
                                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-lg text-slate-400 line-through">
                                    R$ {(product.price * 1.2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <p className="mt-2 text-primary font-black uppercase italic">
                                Ou em até 10x de R$ {(product.price / 10).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
                            </p>
                        </div>


                        <div className="mb-12 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-32 items-center justify-between rounded-xl border border-slate-200 bg-white px-2">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 text-xl text-slate-400 hover:text-slate-900">-</button>
                                    <span className="font-black text-slate-900">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="w-8 text-xl text-slate-400 hover:text-slate-900">+</button>
                                </div>
                                <Button
                                    onClick={handleAddToCart}
                                    className="h-12 flex-1 rounded-xl bg-primary text-black font-black uppercase tracking-widest transition-transform hover:scale-[1.02] shadow-lg shadow-primary/20"
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar ao Carrinho
                                </Button>
                            </div>
                            <Button
                                onClick={() => {
                                    handleAddToCart();
                                    router.push('/checkout');
                                }}
                                variant="outline"
                                className="h-12 w-full rounded-xl border-slate-200 bg-white text-slate-900 font-black uppercase tracking-widest hover:bg-slate-50"
                            >
                                Comprar Agora
                            </Button>
                        </div>

                        {/* Product Benefits */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <BenefitItem icon={<Truck className="h-4 w-4" />} text="Frete Grátis acima de R$ 499" />
                            <BenefitItem icon={<RotateCcw className="h-4 w-4" />} text="7 Dias para Devolução" />
                        </div>

                        <div className="mt-12">
                            <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
                                Especificações Técnicas
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {product.specs?.map((spec) => (
                                    <div key={spec.label} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm border border-slate-100">
                                        <span className="text-slate-500 font-bold uppercase">{spec.label}</span>
                                        <span className="text-slate-900 font-black">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Descrição abaixo das fotos */}
                    <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-5">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Descrição</h3>
                        <p className="text-base leading-relaxed text-slate-600">{product.description}</p>
                    </div>
                </div>
            </main>
            <AppFooter />
        </div>
    );
}

function BenefitItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center border border-slate-100 shadow-sm">
            <div className="text-primary">{icon}</div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{text}</span>
        </div>
    );
}
