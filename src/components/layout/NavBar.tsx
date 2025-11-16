"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, List, MapPin } from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();

  const menu = [
    { label: "Buscar por Placa", href: "/consultar", icon: <Search size={16} /> },
    { label: "Buscar sem Placa", href: "/buscar", icon: <List size={16} /> },
    { label: "Oficinas Próximas", href: "/oficinas", icon: <MapPin size={16} /> },
  ];

  return (
    <header className="w-full bg-[#00B8FF] border-b border-white/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="font-bold text-white text-xl">
          TUREGGON STORE
        </Link>

        {/* MENU */}
        <nav className="flex items-center gap-4">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-white text-black"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        {/* BOTÃO SISTEMA */}
        <Link
          href="/sistema"
          className="px-4 py-2 bg-white text-black font-semibold rounded-lg text-sm"
        >
          Sistema Online
        </Link>
      </div>

      {/* BARRA EXTRA DE PLACA */}
      {pathname === "/consultar" && (
        <div className="w-full bg-[#00B8FF]/60 border-t border-white/20 py-3">
          <p className="text-center text-white text-sm">
            Digite a placa no campo abaixo
          </p>
        </div>
      )}
    </header>
  );
}
