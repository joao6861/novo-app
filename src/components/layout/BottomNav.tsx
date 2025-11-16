"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Star, MapPin } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { label: "Início", icon: <Home size={20} />, href: "/" },
    { label: "Consultar", icon: <Search size={20} />, href: "/consultar" },
    { label: "Oficinas", icon: <MapPin size={20} />, href: "/oficinas" },
    { label: "Avaliações", icon: <Star size={20} />, href: "/avaliacoes" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#001f3f] border-t border-white/10 flex justify-around py-2 md:hidden z-50">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center text-xs ${
            pathname === item.href ? "text-blue-400" : "text-white/70"
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
