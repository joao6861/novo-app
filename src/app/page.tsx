"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/home/hero-section";
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

// Sample Products
const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "Óleo 5W30 Castrol Magnatec",
    category: "Lubrificantes",
    price: 349.90,
    image: "https://images.unsplash.com/photo-1594491959868-874b6e5f8f53?q=80&w=400&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 2,
    name: "Pastilha de Freio Brembo",
    category: "Freios",
    price: 890.00,
    image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=400&auto=format&fit=crop",
    rating: 4,
  },
  {
    id: 3,
    name: "Filtro de Ar Esportivo K&N",
    category: "Filtros",
    price: 450.00,
    image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=400&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 4,
    name: "Amortecedor Monroe OESpectrum",
    category: "Suspensão",
    price: 1250.00,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=400&auto=format&fit=crop",
    rating: 5,
  },
];

export default function Home() {
  const { addToCart } = useCart();

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Trust Badges */}
      <section className="border-y border-white/5 bg-black/40 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6 text-primary" />}
              title="Compra Segura"
              desc="Pagamentos protegidos e garantia total."
            />
            <FeatureCard
              icon={<Truck className="h-6 w-6 text-primary" />}
              title="Entrega Rápida"
              desc="Enviamos para todo o Brasil em tempo recorde."
            />
            <FeatureCard
              icon={<Headphones className="h-6 w-6 text-primary" />}
              title="Suporte Técnico"
              desc="Especialistas prontos para te ajudar."
            />
            <FeatureCard
              icon={<Star className="h-6 w-6 text-primary" />}
              title="Elite Rewards"
              desc="Ganhe pontos em todas as suas compras."
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white lg:text-4xl">
                Mais Vendidos
              </h2>
              <p className="mt-2 text-slate-400">
                Os itens mais procurados pelos entusiastas.
              </p>
            </div>
            <Link href="/shop">
              <Button variant="link" className="text-primary font-bold uppercase tracking-widest flex items-center gap-2">
                Ver Tudo <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto px-4">
          <div className="glass-premium relative overflow-hidden rounded-3xl p-12 lg:p-24">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl font-black leading-tight text-white lg:text-6xl">
                Pronto para dar <br />
                <span className="text-primary">Upgrade</span> no seu carro?
              </h2>
              <p className="mt-6 text-lg text-slate-400">
                Seja para manutenção básica ou performance extrema, a Tureggon tem o que você precisa.
                Consulte por placa e economize tempo.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button className="h-14 px-10 rounded-xl bg-primary text-black font-black uppercase tracking-wider hover:scale-105 transition-transform">
                    Começar agora
                  </Button>
                </Link>
                <Button variant="outline" className="h-14 px-10 rounded-xl border-white/10 bg-white/5 text-white font-black uppercase tracking-wider backdrop-blur-sm hover:bg-white/10 transition-all">
                  Conhecer a empresa
                </Button>
              </div>
            </div>
            {/* Abstract Background Element */}
            <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[150px]" />
          </div>
        </div>
      </section>

      {/* Footer minimal for now */}
      <footer className="border-t border-white/5 bg-black py-12">
        <div className="container mx-auto px-4 text-center">
          <span className="text-2xl font-black tracking-tighter text-white/20 italic">
            TUREGGON
          </span>
          <p className="mt-4 text-sm text-slate-600">
            © 2024 Tureggon Elite Store. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-white uppercase tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: any; onAdd: () => void }) {
  return (
    <Card className="glass group overflow-hidden border-none transition-all hover:scale-[1.02]">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-slate-900">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <Badge className="absolute right-4 top-4 bg-primary text-black font-bold">
            NOVO
          </Badge>
        </div>
        <div className="p-6">
          <span className="text-xs font-bold uppercase tracking-widest text-primary/60">
            {product.category}
          </span>
          <h3 className="mt-2 font-bold text-white transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-black text-white">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <Button
              onClick={onAdd}
              size="icon"
              className="h-10 w-10 rounded-full bg-white/5 hover:bg-primary hover:text-black transition-all"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
