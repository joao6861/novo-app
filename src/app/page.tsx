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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ESTETICA_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
            ))}
          </div>
        </div>
      </section>

      {/* Unified Brand & Trust Section - Simplified layout */}
      <section className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black italic uppercase text-slate-900 md:text-5xl">
              Tureggon <span className="text-primary italic">Elite</span> Store
            </h2>
            <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
              Curadoria das melhores peças e produtos de alta performance. Entregamos em todo o Brasil com o suporte técnico de quem respira cultura automotiva.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-6 border-t border-slate-200/60 pt-10">
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

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="text-center md:text-left">
              <Image
                src="/logo-tureggon.png"
                alt="Tureggon Logo"
                width={120}
                height={35}
                className="h-8 w-auto object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all sm:mx-0 mx-auto"
              />
              <p className="mt-2 text-xs uppercase tracking-widest text-slate-500">
                Premium Performance & Care
              </p>
            </div>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <Link href="/politica" className="hover:text-primary transition-colors">Políticas</Link>
              <Link href="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
              <Link href="/termos" className="hover:text-primary transition-colors">Termos</Link>
            </div>
            <p className="text-sm text-slate-600">
              © 2024 Tureggon. Made with Elite Tech.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function SectionHeader({ title, subtitle, link }: { title: string; subtitle: string; link: string }) {
  return (
    <div className="mb-12 flex items-center justify-between">
      <div className="relative inline-flex flex-col bg-primary px-8 py-5 rounded-[2.5rem] shadow-xl shadow-primary/20 border-b-4 border-black/10">
        <h2 className="text-xl font-black uppercase tracking-tight text-black lg:text-3xl italic leading-tight">
          {title}
        </h2>
        <p className="mt-1 text-black/60 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
          {subtitle}
        </p>
        {/* Balloon Tail Tip */}
        <div className="absolute -bottom-2 left-10 h-0 w-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-primary" />
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
    <Card className="group overflow-hidden border-slate-100 bg-white shadow-sm shadow-neon transition-all hover:translate-y-[-4px]">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-500 group-hover:scale-110"
          />
          {product.off && (
            <Badge className="absolute left-4 top-4 bg-accent text-black font-black uppercase tracking-tighter text-[10px]">
              {product.off}% OFF
            </Badge>
          )}
          {!product.off && (
            <Badge className="absolute left-4 top-4 bg-primary text-black font-black uppercase tracking-tighter text-[10px]">
              NOVO
            </Badge>
          )}
        </div>
        <div className="p-5">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">
            {product.category}
          </span>
          <h3 className="mt-1 font-bold text-slate-900 text-sm line-clamp-2 h-10 transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col">
              {product.oldPrice && (
                <span className="text-[10px] text-slate-400 line-through">
                  R$ {product.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              )}
              <span className="text-lg font-black text-slate-900">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <Button
              onClick={onAdd}
              className="flex-1 h-10 rounded-xl bg-[#30FF00] text-black font-black uppercase tracking-widest text-[10px] hover:bg-[#2ae600] transition-all border-b-2 border-black/10 shadow-lg shadow-[#30FF00]/20"
            >
              COMPRAR
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
