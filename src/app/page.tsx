// NOVO LAYOUT — TABS SEPARADAS (CONSULTA • OFICINAS • VEÍCULOS • AVALIAÇÕES)
// Layout totalmente reorganizado, mais claro e dividido por seções.
// A UI agora funciona igual a aplicativos profissionais.

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { VEHICLE_BRANDS } from "@/lib/vehicle-brands";
import { brazilStates, getCitiesByState } from "@/lib/brazil-locations";

import { Search, MapPin, Car, Star } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("consulta");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedEngine, setSelectedEngine] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const [plate, setPlate] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleStateChange = (uf: string) => {
    setSelectedState(uf);
    setAvailableCities(getCitiesByState(uf));
  };

  return (
    <main className="min-h-screen bg-[#00B8FF] text-black pb-24">

      {/* HEADER */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-white drop-shadow">Tureggon</h1>
        <p className="text-white/80">Sistema Automotivo Inteligente</p>
      </div>

      {/* TABS */}
      <div className="flex justify-center gap-4 mb-4 text-white font-semibold">
        <button
          className={activeTab === "consulta" ? "underline" : "opacity-70"}
          onClick={() => setActiveTab("consulta")}
        >
          Consulta
        </button>
        <button
          className={activeTab === "oficinas" ? "underline" : "opacity-70"}
          onClick={() => setActiveTab("oficinas")}
        >
          Oficinas
        </button>
        <button
          className={activeTab === "veiculos" ? "underline" : "opacity-70"}
          onClick={() => setActiveTab("veiculos")}
        >
          Veículos
        </button>
        <button
          className={activeTab === "avaliacoes" ? "underline" : "opacity-70"}
          onClick={() => setActiveTab("avaliacoes")}
        >
          Avaliações
        </button>
      </div>

      {/* PAINEL PRINCIPAL */}
      <div className="max-w-lg mx-auto w-full px-4">

        {/* ------------------------- ABA CONSULTA ------------------------- */}
        {activeTab === "consulta" && (
          <Card className="p-6 rounded-3xl shadow-2xl bg-white space-y-5">
            <h2 className="text-2xl font-bold text-center">Consultas Automotivas</h2>

            {/* CONSULTA POR PLACA */}
            <div className="space-y-2">
              <Label>Consulta pela Placa</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="ABC1D23"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  className="uppercase"
                />
                <Button onClick={() => setShowResults(true)} className="bg-black text-white">
                  <Search size={20} />
                </Button>
              </div>
            </div>

            {/* MARCA */}
            <div className="space-y-2">
              <Label>Marca do veículo</Label>
              <Select onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_BRANDS.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* VEÍCULO */}
            <div className="space-y-2">
              <Label>Veículo</Label>
              <Input
                placeholder="Ex: Sandero"
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
              />
            </div>

            {/* MOTOR */}
            <div className="space-y-2">
              <Label>Motor</Label>
              <Input
                placeholder="Ex: 1.0, 1.6, 2.0"
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value)}
              />
            </div>

            {/* ANO */}
            <div className="space-y-2">
              <Label>Ano</Label>
              <Input
                placeholder="Ex: 2020"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              />
            </div>

            {/* RESULTADO */}
            {showResults && (
              <Card className="p-4 bg-gray-50 border shadow">
                <p className="font-bold text-lg">Resultado da consulta</p>
                <p>Placa: {plate}</p>
                <p>Marca: {selectedBrand}</p>
                <p>Veículo: {selectedVehicle}</p>
                <p>Motor: {selectedEngine}</p>
                <p>Ano: {selectedYear}</p>
              </Card>
            )}
          </Card>
        )}

        {/* ------------------------- ABA OFICINAS ------------------------- */}
        {activeTab === "oficinas" && (
          <Card className="p-6 bg-white rounded-3xl shadow-2xl space-y-5">
            <h2 className="text-2xl text-center font-bold">Oficinas Próximas</h2>

            {/* ESTADO */}
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select onValueChange={handleStateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {brazilStates.map((uf) => (
                    <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CIDADE */}
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Select onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cidade" />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full bg-black text-white text-ml">Buscar Oficinas</Button>
          </Card>
        )}

        {/* ------------------------- ABA VEÍCULOS ------------------------- */}
        {activeTab === "veiculos" && (
          <Card className="p-6 bg-white rounded-3xl shadow-xl text-center">
            <h2 className="text-2xl font-bold">Meus Veículos</h2>
            <p className="text-gray-500 mt-2">Nenhum veículo cadastrado ainda.</p>
          </Card>
        )}

        {/* ------------------------- ABA AVALIAÇÕES ------------------------- */}
        {activeTab === "avaliacoes" && (
          <Card className="p-6 bg-white rounded-3
        {/* ------------------------- ABA AVALIAÇÕES ------------------------- */}
        {activeTab === "avaliacoes" && (
          <Card className="p-6 bg-white rounded-3xl shadow-xl space-y-4">
            <h2 className="text-2xl font-bold text-center">Avaliações de Oficinas</h2>

            <p className="text-gray-600 text-center">
              Em breve você poderá avaliar oficinas, ver notas e histórico de serviços.
            </p>

            <div className="flex justify-center pt-4">
              <Star className="text-yellow-500" size={40} />
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
