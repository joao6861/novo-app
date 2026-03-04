import React from "react";
import Image from "next/image";
import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-center md:text-left">

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

          {/* 3. Google Ratings & Info */}
          <div className="flex flex-col items-center md:items-end gap-6 text-center md:text-right">
            <div className="flex items-center gap-3">
              <Image
                src="/google-rating.png"
                alt="Google Rating"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
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
