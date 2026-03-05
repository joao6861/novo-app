"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AppFooter } from "@/components/layout/AppFooter";
import { useRouter } from "next/navigation";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/shop?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            <Navbar />
            <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
                <div className="w-full max-w-2xl space-y-8 text-center">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
                        Buscar <span className="text-primary italic">Produtos</span>
                    </h1>

                    <form onSubmit={handleSearch} className="relative flex items-center w-full">
                        <Search className="absolute left-4 h-6 w-6 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="O que o seu projeto precisa hoje? (Ex: Turbina, Cera...)"
                            className="h-16 w-full rounded-2xl border-slate-200 bg-white pl-14 pr-32 text-lg shadow-sm focus:border-primary focus:ring-primary"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        <Button type="submit" className="absolute right-2 h-12 rounded-xl bg-slate-900 px-6 font-black uppercase tracking-wider text-primary hover:bg-slate-800">
                            Buscar
                        </Button>
                    </form>
                </div>
            </main>
            <AppFooter />
        </div>
    );
}
