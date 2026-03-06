import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AppFooter } from "@/components/layout/AppFooter";
import { consultarPlaca } from "@/lib/placa-api";
import type { FiltroItem } from "@/lib/vehicle-database";
import {
    Car, AlertCircle, Droplet, Wrench, Settings, Battery, Thermometer,
    ExternalLink, Info, Gauge, Fuel, Shield, MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const metadata = {
    title: "Garagem Técnica - Tureggon Elite Store",
    description: "Relatório de especificações, peças e fluidos compatíveis com seu veículo.",
};

/* ─── Componente: Botão "Ver no site" ─── */
function BtnVerNoSite({ codigo }: { codigo: string }) {
    const cleanCode = codigo.replace(/\s*(PLÁSTICO|INTERNO.*|OPCIONAL|ORIGINAL)$/i, '').trim();
    return (
        <Link
            href={`/shop?q=${encodeURIComponent(cleanCode)}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
            <ExternalLink size={10} strokeWidth={3} />
            Ver no site
        </Link>
    );
}

/* ─── Componente: Linha de filtro individual ─── */
function FilterRow({ item }: { item: FiltroItem }) {
    if (!item.codigo && !item.marca) return null;
    return (
        <div className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-100 last:border-0 group">
            <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-slate-900">{item.codigo || '—'}</span>
                {item.marca && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {item.marca}
                    </span>
                )}
            </div>
            {item.codigo && <BtnVerNoSite codigo={item.codigo} />}
        </div>
    );
}

/* ─── Componente: Card de Filtros ─── */
function FilterCard({ title, icon, items }: { title: string; icon: React.ReactNode; items?: FiltroItem[] }) {
    if (!items || items.length === 0) return null;
    return (
        <Card className="border-slate-200 bg-white shadow-neon-blue overflow-hidden transition-all hover:border-primary/30">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50 pb-3">
                <CardTitle className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-900">
                    {icon} {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
                {items.map((item, i) => (
                    <FilterRow key={`${item.marca}-${item.codigo}-${i}`} item={item} />
                ))}
            </CardContent>
        </Card>
    );
}

/* ─── Componente: Item de especificação ─── */
function SpecItem({ label, value, unit }: { label: string; value?: string | number | null; unit?: string }) {
    if (!value && value !== 0) return null;
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
            <p className="text-sm font-semibold text-slate-900">
                {value}{unit ? <span className="text-slate-500 ml-1">{unit}</span> : ''}
            </p>
        </div>
    );
}

/* ─── Componente: Card de Óleo ─── */
function OilCard({ title, litros, viscosidade, especificacao }: {
    title: string; litros?: number | null; viscosidade?: string | null; especificacao?: string | null;
}) {
    if (!litros && !viscosidade && !especificacao) return null;
    return (
        <div className="group rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3 transition-all hover:border-primary/30 hover:shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-primary">{title}</p>
            <div className="grid grid-cols-3 gap-3">
                <SpecItem label="Litros" value={litros} unit="L" />
                <SpecItem label="Viscosidade" value={viscosidade} />
                <SpecItem label="Especificação" value={especificacao} />
            </div>
            {viscosidade && (
                <div className="pt-2 border-t border-slate-200/60">
                    <BtnVerNoSite codigo={viscosidade.split(' ')[0] || viscosidade} />
                </div>
            )}
        </div>
    );
}

/* ─── Componente Principal ─── */
async function VehicleReport({ placa }: { placa: string }) {
    let vehicleData = null;

    try {
        vehicleData = await consultarPlaca(placa);
    } catch (error) {
        console.error("Erro na consulta de Placa:", error);
    }

    if (!vehicleData) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <AlertCircle className="h-16 w-16 text-yellow-500 mb-6" />
                <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 mb-4">
                    Veículo Não Encontrado
                </h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                    Não conseguimos localizar os dados para a placa <strong className="text-slate-900 uppercase">{placa}</strong>. Verifique se a placa foi digitada corretamente.
                </p>
                <Link href="/">
                    <Button className="h-12 px-8 rounded-xl bg-primary text-black font-black uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20">
                        Fazer Nova Busca
                    </Button>
                </Link>
            </div>
        );
    }

    const db = vehicleData.dbMatch;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* ═══ HEADER DO VEÍCULO ═══ */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-neon-blue relative overflow-hidden group">
                {/* Background Decor + Tartaruga */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10"></div>
                {/* Turbo Turtle decorativa */}
                <div className="absolute right-0 bottom-0 w-28 h-28 md:w-40 md:h-40 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500 rotate-6">
                    <Image src="/turtle-mascot-transparent.png" alt="Turbo Turtle" fill className="object-contain" />
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm shadow-neon">
                        <Car size={48} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-600 mb-3 border border-slate-200">
                            Placa: <span className="text-primary">{vehicleData.placa.replace(/^(.{3})(.{4})$/, "$1-$2")}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-950 mb-2">
                            {vehicleData.marca} <span className="text-primary">{vehicleData.modelo}</span>
                        </h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500 font-medium mt-3">
                            {vehicleData.ano && vehicleData.ano !== 'N/A' && (
                                <span className="flex items-center gap-1.5"><Info size={14} className="text-primary" /> Ano: <strong className="text-slate-900">{vehicleData.ano}{vehicleData.anoModelo && vehicleData.anoModelo !== vehicleData.ano ? `/${vehicleData.anoModelo}` : ''}</strong></span>
                            )}
                            {vehicleData.cor && vehicleData.cor !== 'N/A' && (
                                <span className="flex items-center gap-1.5"><Shield size={14} className="text-primary" /> Cor: <strong className="text-slate-900 capitalize">{vehicleData.cor}</strong></span>
                            )}
                            {vehicleData.combustivel && (
                                <span className="flex items-center gap-1.5"><Fuel size={14} className="text-primary" /> <strong className="text-slate-900 capitalize">{vehicleData.combustivel}</strong></span>
                            )}
                            {vehicleData.situacao && (
                                <span className="flex items-center gap-1.5"><Shield size={14} className="text-primary" /> <strong className={`capitalize ${vehicleData.situacao.toLowerCase().includes('circula') ? 'text-emerald-600' : 'text-yellow-600'}`}>{vehicleData.situacao}</strong></span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dados extras da API */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
                    <SpecItem label="Chassi" value={vehicleData.chassi} />
                    <SpecItem label="Renavam" value={vehicleData.renavam} />
                    <SpecItem label="Motor" value={vehicleData.motor} />
                    <SpecItem label="Potência" value={vehicleData.potencia} unit="cv" />
                    <SpecItem label="Cilindros" value={vehicleData.cilindros} />
                    <SpecItem label="Tipo" value={vehicleData.tipo_veiculo} />
                    <SpecItem label="Origem" value={vehicleData.origem} />
                    {vehicleData.municipio && vehicleData.uf && (
                        <div className="space-y-1 col-span-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Localidade</p>
                            <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 capitalize">
                                <MapPin size={12} className="text-primary" /> {vehicleData.municipio} - {vehicleData.uf?.toUpperCase()}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ DADOS TÉCNICOS (BANCO OU API) ═══ */}
            {db ? (
                <>
                    {/* Badge de match */}
                    <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/20 px-5 py-3 shadow-sm shadow-neon/10">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse shadow-sm shadow-primary" />
                        <p className="text-sm font-bold text-slate-800">
                            Dados técnicos encontrados: <span className="text-primary font-black uppercase text-xs">{db.veiculo_raw}</span>
                        </p>
                    </div>

                    {/* ─── Informações Técnicas Base ─── */}
                    <Card className="border-slate-200 bg-white shadow-neon-blue transition-all hover:border-primary/20">
                        <CardHeader className="border-b border-slate-50 bg-slate-50/50 pb-4">
                            <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-slate-950">
                                <Gauge className="h-5 w-5 text-primary" /> Especificações do Motor
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                            <SpecItem label="Cilindrada" value={db.motor_litros} unit="L" />
                            <SpecItem label="Válvulas" value={db.motor_valvulas} />
                            <SpecItem label="Potência" value={db.potencia_cv} unit="cv" />
                            <SpecItem label="Câmbio" value={db.cambio_info} />
                            <SpecItem label="Combustível" value={db.combustivel} />
                            <SpecItem label="Ano" value={db.ano_de && db.ano_ate ? `${db.ano_de} - ${db.ano_ate}` : db.ano_de ? `A partir de ${db.ano_de}` : undefined} />
                        </CardContent>
                    </Card>

                    {/* ─── ÓLEOS E FLUIDOS ─── */}
                    <Card className="border-slate-200 bg-white shadow-neon-blue transition-all hover:border-primary/20">
                        <CardHeader className="border-b border-slate-50 bg-slate-50/50 pb-4">
                            <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-slate-950">
                                <Droplet className="h-5 w-5 text-primary" /> Óleos e Fluidos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <OilCard
                                title="Óleo do Motor"
                                litros={db.oleo_motor_litros}
                                viscosidade={db.oleo_motor_viscosidade}
                                especificacao={db.oleo_motor_especificacao}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <OilCard
                                    title="Câmbio Manual"
                                    litros={db.oleo_cambio_manual_litros}
                                    viscosidade={db.oleo_cambio_manual_viscosidade}
                                    especificacao={db.oleo_cambio_manual_especificacao}
                                />
                                <OilCard
                                    title="Câmbio Automático"
                                    litros={db.oleo_cambio_auto_total_litros}
                                    viscosidade={db.oleo_cambio_auto_especificacao}
                                    especificacao={db.oleo_cambio_auto_parcial_litros ? `Parcial: ${db.oleo_cambio_auto_parcial_litros}L` : undefined}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* ─── BATERIA E SISTEMAS ─── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border-slate-200 bg-white shadow-neon-blue">
                            <CardHeader className="border-b border-slate-50 bg-slate-50/50 pb-4">
                                <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-slate-950">
                                    <Battery className="h-5 w-5 text-primary" /> Bateria
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <SpecItem label="Capacidade" value={db.bateria_capacidade_ah} unit="Ah" />
                                        <SpecItem label="CCA" value={db.bateria_cca} unit="A" />
                                    </div>
                                    <SpecItem label="Polo Positivo" value={db.bateria_polo_positivo} />
                                    {(db.bateria_capacidade_ah) && (
                                        <div className="pt-2 border-t border-slate-200/60">
                                            <BtnVerNoSite codigo={`bateria ${db.bateria_capacidade_ah}ah`} />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 bg-white shadow-neon-blue">
                            <CardHeader className="border-b border-slate-50 bg-slate-50/50 pb-4">
                                <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-slate-950">
                                    <Thermometer className="h-5 w-5 text-primary" /> Outros Fluidos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 grid grid-cols-1 gap-4">
                                {db.fluido_freio_tipo && (
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                                        <SpecItem label="Fluido de Freio" value={db.fluido_freio_tipo} />
                                        <BtnVerNoSite codigo={db.fluido_freio_tipo} />
                                    </div>
                                )}
                                {db.aditivo_radiador_tipo && (
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                                        <SpecItem label="Aditivo Radiador" value={db.aditivo_radiador_tipo} />
                                        <BtnVerNoSite codigo="aditivo radiador" />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* ─── FILTROS ─── */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-black uppercase tracking-widest text-slate-950 flex items-center gap-3">
                            <Wrench className="h-5 w-5 text-primary" /> Filtros Compatíveis
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FilterCard
                                title="Filtro de Óleo"
                                icon={<Droplet size={16} className="text-primary" />}
                                items={db.filtros?.oleo}
                            />
                            <FilterCard
                                title="Filtro de Ar"
                                icon={<Settings size={16} className="text-primary" />}
                                items={db.filtros?.ar}
                            />
                            <FilterCard
                                title="Filtro de Cabine (A/C)"
                                icon={<Thermometer size={16} className="text-primary" />}
                                items={db.filtros?.cabine}
                            />
                            <FilterCard
                                title="Filtro de Combustível"
                                icon={<Fuel size={16} className="text-primary" />}
                                items={db.filtros?.combustivel}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-8">
                    <div className="rounded-xl border border-yellow-500/20 bg-yellow-50/50 px-6 py-5 flex items-center gap-4">
                        <AlertCircle className="h-6 w-6 text-yellow-500 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-slate-900">Dados técnicos detalhados não encontrados no banco Tureggon</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Exibindo apenas as especificações reais retornadas pela API. Filtros e óleos específicos não foram localizados para este modelo exato.
                            </p>
                        </div>
                    </div>

                    <Card className="border-slate-200 bg-white shadow-neon-blue">
                        <CardHeader className="border-b border-slate-50 bg-slate-50/50 pb-4">
                            <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-slate-950">
                                <Gauge className="h-5 w-5 text-primary" /> Especificações Reais (API)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                            <SpecItem label="Motor" value={vehicleData.motor} />
                            <SpecItem label="Potência" value={vehicleData.potencia} unit="cv" />
                            <SpecItem label="Cilindros" value={vehicleData.cilindros} />
                            <SpecItem label="Combustível" value={vehicleData.combustivel} />
                            <SpecItem label="Chassi" value={vehicleData.chassi} />
                            <SpecItem label="Renavam" value={vehicleData.renavam} />
                            <SpecItem label="Tipo" value={vehicleData.tipo_veiculo} />
                            <SpecItem label="Município" value={vehicleData.municipio} />
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ─── BOTÃO VOLTAR ─── */}
            <div className="text-center pt-8 border-t border-slate-100">
                <Link href="/">
                    <Button variant="outline" className="h-12 px-8 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-black uppercase tracking-widest text-xs">
                        ← Nova Consulta
                    </Button>
                </Link>
            </div>
        </div>
    );
}

function ReportSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-48 rounded-2xl bg-slate-100 border border-slate-200"></div>
            <div className="h-12 rounded-xl bg-slate-50 border border-slate-100"></div>
            <div className="h-40 rounded-xl bg-slate-100 border border-slate-200"></div>
            <div className="h-64 rounded-xl bg-slate-100 border border-slate-200"></div>
        </div>
    );
}

export default async function VehicleDetailsPage({ params }: { params: Promise<{ placa: string }> }) {
    const { placa } = await params;
    const placaUrl = placa || "";

    return (
        <div className="min-h-screen bg-white flex flex-col selection:bg-primary/30 selection:text-slate-900">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-32 mb-16 max-w-5xl">
                <div className="mb-12 relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary/20 rounded-full"></div>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-2 pl-4">Garagem Virtual</h2>
                    <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tight pl-4 flex items-center gap-3">
                        Relatório Técnico <span className="p-1 rounded bg-primary text-white text-xs align-middle">PRO</span>
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
