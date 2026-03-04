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
            <svg
                className="h-7 w-7 transition-transform group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                <path d="M16 11l-2.5 2.5a1.5 1.5 0 0 1-2 0L9 11" />
            </svg>
            <span className="absolute right-full mr-4 whitespace-nowrap rounded-lg bg-black/80 px-4 py-2 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none backdrop-blur-md border border-white/10 uppercase tracking-widest">
                Fale conosco
            </span>
            <span className="absolute inset-0 rounded-full bg-[#30FF00] opacity-20 animate-ping pointer-events-none"></span>
        </a>
    );
}
