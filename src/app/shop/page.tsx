"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Search,
    X,
    Filter,
    ChevronDown,
    ShoppingCart,
    LayoutGrid,
    List,
    Star
} from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import { AppFooter } from "@/components/layout/AppFooter";

// Mock Categories
const CATEGORIES = [
    "Todos",
    "Óleos e Fluidos",
    "Filtros",
    "Freios",
    "Suspensão",
    "Motor",
    "Elétrica",
    "Acessórios",
];

// Mock Products
const ALL_PRODUCTS = [
    {
        id: 1,
        name: "Óleo 5W30 Castrol Magnatec",
        category: "Óleos e Fluidos",
        price: 349.90,
        image: "https://images.unsplash.com/photo-1594491959868-874b6e5f8f53?q=80&w=400&auto=format&fit=crop",
        brand: "Castrol",
    },
    {
        id: 2,
        name: "Pastilha de Freio Brembo",
        category: "Freios",
        price: 890.00,
        image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=400&auto=format&fit=crop",
        brand: "Brembo",
    },
    {
        id: 3,
        name: "Filtro de Ar Esportivo K&N",
        category: "Filtros",
        price: 450.00,
        image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=400&auto=format&fit=crop",
        brand: "K&N",
    },
    {
        id: 4,
        name: "Amortecedor Monroe OESpectrum",
        category: "Suspensão",
        price: 1250.00,
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=400&auto=format&fit=crop",
        brand: "Monroe",
    },
    {
        id: 5,
        name: "Bateria Heliar 60Ah",
        category: "Elétrica",
        price: 580.00,
        image: "https://images.unsplash.com/photo-1597766333691-b1e847c0a87f?q=80&w=400&auto=format&fit=crop",
        brand: "Heliar",
    },
    {
        id: 6,
        name: "Disco de Freio Ventilado",
        category: "Freios",
        price: 420.00,
        image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400&auto=format&fit=crop",
        brand: "TRW",
    },
];

export default function Shop() {
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [searchTerm, setSearchTerm] = useState("");
    const { addToCart } = useCart();

    const filteredProducts = ALL_PRODUCTS.filter((p) => {
        const matchesCategory = selectedCategory === "Todos" || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="container mx-auto px-4 py-12">
                <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-950 lg:text-5xl">
                            Catálogo de <span className="text-gradient">Peças</span>
                        </h1>
                        <p className="mt-2 text-slate-500">
                            {filteredProducts.length} produtos encontrados
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                placeholder="Buscar peças..."
                                className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 text-slate-900 placeholder:text-slate-400 lg:w-80 focus:border-primary outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="h-11 gap-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-50">
                            <Filter className="h-4 w-4" /> Filtros
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-12 lg:flex-row">
                    {/* Sidebar Filters */}
                    <aside className="shrink-0 lg:w-64">
                        <div className="sticky top-28 space-y-8">
                            <div>
                                <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">
                                    Categorias
                                </h3>
                                <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`text-left rounded-lg px-3 py-2 text-sm font-bold transition-all ${selectedCategory === cat
                                                ? "bg-primary text-black"
                                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-primary/5 p-6 border border-primary/10">
                                <h4 className="font-black text-primary uppercase text-xs tracking-wider">
                                    Precisa de ajuda?
                                </h4>
                                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                                    Fale com nossos especialistas agora mesmo via WhatsApp.
                                </p>
                                <Button className="mt-4 w-full bg-accent text-black font-black text-xs h-9">
                                    CONTATO WHATSAPP
                                </Button>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-6">
                            <div className="flex items-center gap-4">
                                <Button size="icon" variant="ghost" className="text-primary">
                                    <LayoutGrid className="h-5 w-5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="text-slate-500">
                                    <List className="h-5 w-5" />
                                </Button>
                            </div>
                            <Button variant="ghost" className="text-sm font-bold text-slate-400">
                                Ordenar por: <span className="ml-2 text-white">Relevância</span> <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="py-24 text-center">
                                <p className="text-lg font-bold text-slate-500 uppercase tracking-widest">
                                    Nenhum produto encontrado.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <AppFooter />
        </div>
    );
}

function ProductCard({ product, onAdd }: { product: any; onAdd: () => void }) {
    return (
        <Card className="group overflow-hidden border-slate-100 bg-white shadow-sm shadow-neon transition-all hover:translate-y-[-4px] flex flex-col h-full">
            <CardContent className="p-0 flex flex-col h-full">
                {/* Image Section */}
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                    <Link href={`/product/${product.id}`}>
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                        />
                    </Link>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1">
                    {/* 1. Name */}
                    <Link href={`/product/${product.id}`}>
                        <h3 className="font-bold text-slate-900 text-sm h-10 line-clamp-2 transition-colors group-hover:text-primary cursor-pointer leading-tight">
                            {product.name}
                        </h3>
                    </Link>
                    <span className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Cód: #{product.id}
                    </span>

                    {/* 2. Brand & Category */}
                    <div className="mt-1 flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                        <span>{product.category}</span>
                        <span>{product.brand}</span>
                    </div>

                    {/* 3. Discount info (if exists) */}
                    <div className="mt-3 h-5">
                        {product.off && (
                            <span className="text-[11px] font-bold text-[#30FF00]">
                                -{product.off}% OFF
                            </span>
                        )}
                        {!product.off && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                Novo Item
                            </span>
                        )}
                    </div>

                    {/* 4. Price Area */}
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-950">
                            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        {product.oldPrice && (
                            <span className="text-[11px] text-slate-400 line-through">
                                R$ {product.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        )}
                    </div>

                    {/* 5. Rating Stars */}
                    <div className="mt-3 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className="fill-slate-200 text-slate-200" />
                        ))}
                        <span className="ml-1 text-[11px] font-bold text-slate-400">(0)</span>
                    </div>

                    {/* 6. Buy Button (Bottom) */}
                    <div className="mt-auto pt-5">
                        <Link href={`/product/${product.id}`} className="block">
                            <Button
                                className="w-full h-11 rounded-xl bg-[#30FF00] text-black font-black uppercase tracking-widest text-[11px] hover:bg-[#2ae600] transition-all border-b-2 border-black/10 shadow-lg shadow-[#30FF00]/10"
                            >
                                COMPRAR
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
