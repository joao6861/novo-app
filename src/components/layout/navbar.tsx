"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  const { totalItems } = useCart();
  const [searchPlate, setSearchPlate] = React.useState("");

  return (
    <div className="flex flex-col w-full">
      {/* Announcement Bar */}
      <div className="w-full bg-accent py-1.5 px-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black sm:text-xs">
          🚀 Frete Grátis para todo o Brasil em compras acima de R$ 499
        </p>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-premium-dark/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo-tureggon.png"
                alt="Tureggon Logo"
                width={180}
                height={50}
                className="h-10 w-auto object-contain brightness-110"
                priority
              />
            </Link>

            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/shop" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Todos os Produtos
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Categorias</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-slate-950 border border-white/10">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/20 to-transparent p-6 no-underline outline-none focus:shadow-md border border-primary/20"
                            href="/shop?category=performance"
                          >
                            <div className="mb-2 mt-4 text-lg font-bold text-primary">
                              Performance
                            </div>
                            <p className="text-xs leading-tight text-white/60">
                              Turbos, bicos, comandos e eletrônica programável para extrair o máximo do seu motor.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <Link href="/shop?category=escapamento" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/5">
                          <div className="text-sm font-bold leading-none text-white">Escapamento</div>
                          <p className="line-clamp-2 text-xs leading-snug text-white/50">Ponteiras, difusores e sistemas completos em inox.</p>
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?category=estetica" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/5">
                          <div className="text-sm font-bold leading-none text-white">Estética</div>
                          <p className="line-clamp-2 text-xs leading-snug text-white/50">Ceras, selantes e polidores das melhores marcas (Vonixx, Lincoln).</p>
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?category=manutencao" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/5">
                          <div className="text-sm font-bold leading-none text-white">Manutenção</div>
                          <p className="line-clamp-2 text-xs leading-snug text-white/50">Óleos premium, filtros e peças de reposição original.</p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            {/* Subtle Plate Search */}
            <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 focus-within:border-primary/50 transition-all mr-2">
              <Search className="h-3.5 w-3.5 text-white/40 mr-2" />
              <input
                type="text"
                placeholder="Placa do Carro"
                value={searchPlate}
                onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
                className="bg-transparent border-none outline-none text-[11px] font-bold uppercase tracking-widest text-white placeholder:text-white/20 w-24 focus:w-32 transition-all"
              />
            </div>

            <Button variant="ghost" size="icon" className="text-white/70 hover:text-primary transition-colors lg:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-primary transition-colors">
              <User className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-white/70 hover:text-primary transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-black animate-in fade-in zoom-in">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
