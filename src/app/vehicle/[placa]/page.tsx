import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AppFooter } from "@/components/layout/AppFooter";
import { consultarPlaca } from "@/lib/placa-api";
import { Car, AlertCircle, Droplet, Wrench, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Garagem Técnica - Tureggon Elite Store",
    description: "Relatório de especificações, peças e fluidos compatíveis com seu veículo.",
};

// Componente que busca e renderiza os dados
async function VehicleReport({ placa }: { placa: string }) {
    let vehicleData = null;

    try {
        vehicleData = await consultarPlaca(placa);
    } catch (error) {
        console.error("Erro na consulta SSG de Placa:", error);
    }

    if (!vehicleData) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <AlertCircle className="h-16 w-16 text-yellow-500 mb-6" />
                <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-4">
                    Veículo Não Encontrado
                </h2>
                <p className="text-slate-400 max-w-md mx-auto mb-8">
                    Não conseguimos localizar os dados para a placa <strong className="text-white uppercase">{placa}</strong>. Verifique se a placa foi digitada corretamente.
                </p>
                <Link href="/">
                    <Button className="h-12 px-8 rounded-xl bg-primary text-black font-black uppercase tracking-widest hover:bg-primary/90">
                        Fazer Nova Busca
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header do Veículo */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-xl">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                    <Car size={48} strokeWidth={1.5} />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-300 mb-3">
                        Placa: <span className="text-white">{vehicleData.placa.replace(/^(.{3})(.{4})$/, "$1-$2")}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2">
                        {vehicleData.marca} <span className="text-primary">{vehicleData.modelo}</span>
                    </h1>
                    <p className="text-lg text-slate-400 font-medium">
                        Ano: {vehicleData.ano} • Cor: {vehicleData.cor} • Motor: {vehicleData.motor}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card: Motor e Fluidos */}
                <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-white">
                            <Droplet className="h-5 w-5 text-primary" /> Fluidos e Óleos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Óleo do Motor</p>
                                <p className="text-sm font-medium text-white">{vehicleData.oleo_motor}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Capacidade</p>
                                <p className="text-sm font-medium text-white">{vehicleData.capacidade_oleo_motor}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Câmbio Auto / Manual</p>
                                <p className="text-sm font-medium text-white">
                                    {vehicleData.oleo_cambio_automatico !== 'Consulte o manual do veículo' ? vehicleData.oleo_cambio_automatico : vehicleData.oleo_cambio_manual}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Capacidade</p>
                                <p className="text-sm font-medium text-white">
                                    {vehicleData.capacidade_cambio_automatico !== 'Consulte o manual do veículo' ? vehicleData.capacidade_cambio_automatico : vehicleData.capacidade_cambio_manual}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card: Filtros e Manutenção */}
                <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-white">
                            <Wrench className="h-5 w-5 text-primary" /> Sistema de Filtros
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Filtro de Óleo</span>
                            <span className="text-sm font-medium text-white">{vehicleData.filtro_oleo}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Filtro de Ar (Motor)</span>
                            <span className="text-sm font-medium text-white">{vehicleData.filtro_ar}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Filtro de Combustível</span>
                            <span className="text-sm font-medium text-white">{vehicleData.filtro_combustivel}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Filtro de Cabine (A/C)</span>
                            <span className="text-sm font-medium text-white">{vehicleData.filtro_cabine}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Card: Dados Técnicos Extras */}
                <Card className="border-white/10 bg-white/5 backdrop-blur-md md:col-span-2">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-white">
                            <Settings className="h-5 w-5 text-primary" /> Especificações Técnicas Adicionais
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Fluido de Freio</p>
                            <p className="text-sm text-white">{vehicleData.fluido_freio}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Fluido de Direção</p>
                            <p className="text-sm text-white">{vehicleData.fluido_direcao}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Aditivo do Radiador</p>
                            <p className="text-sm text-white">{vehicleData.aditivo_radiador}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Localidade Origem</p>
                            <p className="text-sm text-white">{vehicleData.municipio} - {vehicleData.uf}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ReportSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-32 rounded-2xl bg-white/5 border border-white/5"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 rounded-xl bg-white/5 border border-white/5"></div>
                <div className="h-64 rounded-xl bg-white/5 border border-white/5"></div>
            </div>
        </div>
    );
}

export default function VehicleDetailsPage({ params }: { params: { placa: string } }) {
    const placaUrl = params.placa || "";

    return (
        <div className="min-h-screen bg-premium-dark flex flex-col selection:bg-primary/30 selection:text-white">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-32 mb-16 max-w-5xl">
                <div className="mb-8">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-2">Garagem Virtual</h2>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                        Relatório Técnico
                    </h1>
                </div>

                <Suspense fallback={<ReportSkeleton />}>
                    <VehicleReport placa={placaUrl} />
                </Suspense>
            </main>

            <AppFooter />
        </div>
    );
}
