import React from "react";
import Image from "next/image";
import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-4">
        {/* Logo Section - RESTORED */}
        <div className="mb-12 text-center md:text-left">
          <Image
            src="/logo-tureggon.png"
            alt="Tureggon Logo"
            width={120}
            height={35}
            className="h-8 w-auto object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all sm:mx-0 mx-auto"
          />
          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">
            Premium Performance & Care
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-center md:text-left">

          {/* Left Column: Payments & Shipping */}
          <div className="space-y-12">
            {/* 1. Meios de Pagamento */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Meios de pagamento
              </h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {/* Visa */}
                <div className="bg-white p-1 rounded-sm w-10 h-6 flex items-center justify-center">
                  <span className="text-[10px] font-black italic text-blue-800">VISA</span>
                </div>
                {/* Mastercard */}
                <div className="bg-white p-1 rounded-sm w-10 h-6 flex items-center justify-center gap-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 -ml-1.5" />
                </div>
                {/* AMEX */}
                <div className="bg-[#016fcf] p-1 rounded-sm w-10 h-6 flex items-center justify-center">
                  <span className="text-[6px] font-bold text-white uppercase leading-none text-center">American<br />Express</span>
                </div>
                {/* Bradesco */}
                <div className="bg-white p-1 rounded-sm w-10 h-6 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-sm bg-red-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full border border-white" />
                  </div>
                </div>
                {/* Elo */}
                <div className="bg-black border border-white/20 p-1 rounded-sm w-10 h-6 flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  </div>
                </div>
                {/* Hipercard */}
                <div className="bg-[#b3131b] p-1 rounded-sm w-10 h-6 flex items-center justify-center">
                  <span className="text-[6px] font-black text-white italic">Hipercard</span>
                </div>
                {/* Pix */}
                <div className="bg-[#32bcad] p-1 rounded-sm w-10 h-6 flex items-center justify-center">
                  <span className="text-[8px] font-black text-white italic lowercase">pix</span>
                </div>
              </div>
            </div>

            {/* 2. Meios de Envio */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Meios de envio
              </h4>
              <div className="flex justify-center md:justify-start">
                <div className="bg-white p-1 px-2 rounded-sm flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#ffce00] rounded-sm flex items-center justify-center">
                    <span className="text-[8px] font-black text-blue-900 leading-none">C</span>
                  </div>
                  <span className="text-[9px] font-black text-blue-900 uppercase tracking-tighter">Correios</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Google Ratings & Info */}
          <div className="flex flex-col items-center md:items-end gap-4 text-center md:text-right">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Sua opinião é fundamental
              </h4>
              <p className="text-[11px] text-slate-400 font-medium max-w-[200px] leading-relaxed">
                Avalie nossa loja e ajude a Tureggon a ser cada vez melhor.
              </p>
            </div>

            <Link
              href="https://www.google.com/maps/place/TUREGGON/@-28.1336936,-52.006782,6z/data=!3m1!4b1!4m6!3m5!1s0x94dcfb2b8bb6b5db:0xc19deb1a9509a901!8m2!3d-28.1336936!4d-52.006782!16s%2Fg%2F11nmgpmlpr?entry=ttu&g_ep=EgoyMDI2MDMwMi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              className="group flex flex-col items-center md:items-end gap-2"
            >
              <div className="flex gap-1 group-hover:scale-110 transition-transform">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">★</span>
                ))}
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white bg-white/5 px-4 py-2 rounded-full border border-white/10 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all">
                Avaliar no Google
              </span>
            </Link>

            <div className="pt-4 space-y-1">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                Tureggon Elite Store © 2024
              </p>
              <div className="flex justify-center md:justify-end gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
                <Link href="/politica" className="hover:text-primary transition-colors">Políticas</Link>
                <Link href="/termos" className="hover:text-primary transition-colors">Termos</Link>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">
            Performance - Estética - Tecnologia
          </p>
        </div>
      </div>
    </footer>
  );
}
