"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export function WhatsappButton() {
    const whatsappNumber = "5541997744692";
    const message = "Olá! Vim pelo site da Tureggon e gostaria de tirar uma dúvida.";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#30FF00] text-black shadow-2xl transition-all hover:scale-110 hover:rotate-6 active:scale-95 group"
        >
            <MessageCircle className="h-7 w-7 transition-transform group-hover:scale-110" />
            <span className="absolute right-full mr-4 whitespace-nowrap rounded-lg bg-black/80 px-4 py-2 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none backdrop-blur-md border border-white/10 uppercase tracking-widest">
                Fale conosco
            </span>
            <span className="absolute inset-0 rounded-full bg-[#30FF00] opacity-20 animate-ping pointer-events-none"></span>
        </a>
    );
}
