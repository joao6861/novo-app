"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Truck,
  Headphones,
  ArrowRight,
  Star,
  ShoppingCart
} from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import { BannerCarousel } from "@/components/home/banner-carousel";
import { Newsletter } from "@/components/home/newsletter";
import { WhatsappButton } from "@/components/ui/whatsapp-button";
import { PlateSearchStrip } from "@/components/home/plate-search-strip";
import { AppFooter } from "@/components/layout/AppFooter";

// Sample Products Categorized
const PERFORMANCE_PRODUCTS = [
  {
    id: 101,
    name: "Turbina Master Power R4449",
    category: "Performance",
    price: 3450.00,
    oldPrice: 3800.00,
    image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=400&auto=format&fit=crop",
    rating: 5,
    off: 10,
  },
  {
    id: 102,
    name: "Injeção Programável FuelTech FT450",
    category: "Performance",
    price: 4890.00,
    image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=400&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 103,
    name: "Bico Injetor Bosch 210lbs",
    category: "Performance",
    price: 2150.00,
    oldPrice: 2400.00,
    image: "https://images.unsplash.com/photo-1594491959868-874b6e5f8f53?q=80&w=400&auto=format&fit=crop",
    rating: 4,
    off: 12,
  },
  {
    id: 104,
    name: "Comando de Válvula Sam Cams",
    category: "Performance",
    price: 1850.00,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=400&auto=format&fit=crop",
    rating: 5,
  },
];

const ESTETICA_PRODUCTS = [
  {
    id: 201,
    name: "Cera de Carnaúba Native Vonixx",
    category: "Estética",
    price: 189.90,
    oldPrice: 210.00,
    image: "https://images.unsplash.com/photo-1549399500-c44d07019f85?q=80&w=400&auto=format&fit=crop",
    rating: 5,
    off: 10,
  },
  {
    id: 202,
    name: "Selante Sintético V-Paint Vonixx",
    category: "Estética",
    price: 349.00,
    image: "https://images.unsplash.com/photo-1597328290883-50c5787b7c7e?q=80&w=400&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 203,
    name: "Kit Lavagem Premium Lincoln",
    category: "Estética",
    price: 129.90,
    image: "https://images.unsplash.com/photo-1552933529-e359b2477252?q=80&w=400&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 204,
    name: "Revitalizador de Plásticos Restaurax",
    category: "Estética",
    price: 45.90,
    oldPrice: 59.90,
    image: "https://images.unsplash.com/photo-1621259182978-f09e5e2ca1ff?q=80&w=400&auto=format&fit=crop",
    rating: 4,
    off: 23,
  },
];

export default function Home() {
  const cart = useCart();
  const addToCart = cart ? cart.addToCart : () => { };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Plate Search Strip - High Visibility Area */}
      <PlateSearchStrip />

      {/* Performance Section - PROMINENT POSITION */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Performance & Motor"
            subtitle="Tudo para o seu projeto subir o nível."
            link="/shop?category=performance"
          />
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {PERFORMANCE_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
            ))}
          </div>
        </div>
      </section>

      {/* Estética Section - PROMINENT POSITION */}
      <section className="py-12 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Estética Automotiva"
            subtitle="Brilho e proteção com as melhores marcas."
            link="/shop?category=estetica"
          />
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {ESTETICA_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
            ))}
          </div>
        </div>
      </section>

      {/* Unified Brand & Trust Section - Simplified layout */}
      <section className="py-12 bg-slate-50/50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black italic uppercase text-slate-900 md:text-5xl">
              Tureggon <span className="text-primary italic">Elite</span> Store
            </h2>
            <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
              Curadoria das melhores peças e produtos de alta performance. Entregamos em todo o Brasil com o suporte técnico de quem respira cultura automotiva.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-x-12 gap-y-6 border-t border-slate-200/60 pt-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-700">Compra Segura</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-700">Entrega Rápida</span>
              </div>
              <div className="flex items-center gap-3">
                <Headphones className="h-5 w-5 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-700">Suporte Pro</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-700">Elite Rewards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* WhatsApp Button */}
      <WhatsappButton />

      <AppFooter />
    </main>
  );
}

function SectionHeader({ title, subtitle, link }: { title: string; subtitle: string; link: string }) {
  return (
    <div className="mb-12 flex items-center justify-between">
      <div className="group relative cursor-pointer">
        <div className="relative inline-flex flex-col bg-primary/20 backdrop-blur-md px-8 py-5 rounded-[2.5rem] border border-primary/30 shadow-[0_0_15px_rgba(33,199,234,0.3)] transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.03] group-hover:shadow-[0_0_25px_rgba(33,199,234,0.5)] group-hover:bg-primary/30">
          <h2 className="text-xl font-black uppercase tracking-tight text-black lg:text-3xl italic leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
            {title}
          </h2>
          <p className="mt-1 text-black/80 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
            {subtitle}
          </p>
          {/* Balloon Tail Tip */}
          <div className="absolute -bottom-2 left-10 h-0 w-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-primary/40 transition-colors group-hover:border-t-primary/60" />
        </div>
      </div>
      <Link href={link}>
        <Button variant="link" className="text-primary font-bold uppercase tracking-widest flex items-center gap-2 group p-0 h-auto">
          Ver Tudo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </div>
  );
}



function ProductCard({ product, onAdd }: { product: any; onAdd: () => void }) {
  return (
    <Card className="group overflow-hidden border-slate-100 bg-white shadow-sm shadow-neon transition-all hover:translate-y-[-4px] flex flex-col h-full">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-500 group-hover:scale-110"
          />
          {!product.off && (
            <Badge className="absolute left-4 top-4 bg-primary text-black font-black uppercase tracking-tighter text-[10px]">
              NOVO
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div className="p-2 sm:p-4 flex flex-col flex-1">
          {/* 1. Name */}
          <h3 className="font-bold text-slate-900 text-[10px] sm:text-sm line-clamp-2 h-7 sm:h-10 transition-colors group-hover:text-primary leading-tight">
            {product.name}
          </h3>
          <span className="hidden sm:inline mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Cód: #{product.id}
          </span>

          {/* 2. Discount info (if exists) */}
          <div className="mt-1 h-3 sm:h-5">
            {product.off && (
              <span className="text-[9px] sm:text-[11px] font-bold text-[#30FF00]">
                -{product.off}% OFF
              </span>
            )}
          </div>

          {/* 3. Price Area */}
          <div className="mt-0.5 sm:mt-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <span className="text-sm sm:text-lg font-black text-slate-900">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            {product.oldPrice && (
              <span className="text-[8px] sm:text-[11px] text-slate-400 line-through">
                R$ {product.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {/* 4. Rating Stars - Hidden on mobile for space */}
          <div className="hidden sm:flex mt-2 items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="fill-slate-200 text-slate-200" />
            ))}
            <span className="ml-1 text-[10px] font-bold text-slate-400">(0)</span>
          </div>

          {/* 5. Buy Button (Bottom) */}
          <div className="mt-auto pt-2 sm:pt-4">
            <Button
              onClick={onAdd}
              className="w-full h-8 sm:h-11 rounded-lg sm:rounded-xl bg-[#30FF00] text-black font-black uppercase tracking-widest text-[8px] sm:text-[11px] hover:bg-[#2ae600] transition-all border-b-2 border-black/10 shadow-lg shadow-[#30FF00]/10"
            >
              COMPRAR
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
