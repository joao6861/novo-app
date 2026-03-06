"use client";

import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ChloeSupport() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (!message.trim()) return;

        // Simulação de envio para o Chloe CRM
        console.log("Enviando para Chloe CRM:", message);
        setMessage('');
        // Aqui chamaria chloe.sendMessage()
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-slate-900 p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-cyan-500 flex items-center justify-center">
                                <Bot className="h-6 w-6 text-black" />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-sm uppercase italic tracking-tight">Chloe Assistant</h4>
                                <div className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Online Now</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="h-80 p-4 bg-slate-50 flex flex-col justify-end">
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 max-w-[85%] self-start shadow-sm">
                            <p className="text-sm text-slate-700 font-medium">Olá! Sou a Chloe. Como posso ajudar você com as peças da Tureggon hoje?</p>
                        </div>
                    </div>

                    <div className="p-4 bg-white border-t border-slate-200">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Digite sua mensagem..."
                                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                className="h-10 w-10 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center hover:bg-black transition-all"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-16 w-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group",
                    isOpen ? "bg-slate-900 text-white rotate-90" : "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                )}
            >
                {isOpen ? <X className="h-8 w-8" /> : <MessageCircle className="h-8 w-8 group-hover:animate-bounce" />}

                {!isOpen && (
                    <span className="absolute -top-2 -right-2 h-6 w-6 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                        1
                    </span>
                )}
            </button>
        </div>
    );
}
