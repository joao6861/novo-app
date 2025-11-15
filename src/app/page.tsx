"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Search, MapPin, Car, Wrench, Star, Phone } from "lucide-react";
import { vehicleBrands } from "@/lib/vehicle-brands";
import { brazilStates, getCitiesByState } from "@/lib/brazil-locations";

export default function Home() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [plate, setPlate] = useState("");

  const handleStateChange = (uf: string) => {
    setSelectedState(uf);
    setAvailableCities(getCitiesByState(uf));
  };

  return (
    <main className="min-h-screen bg-[#00B8FF] w-full flex flex-col items-center py-10 px-4">
      {/* HEADER */}
      <div className="flex flex-col items-center mb-8 animate-fade-in">
        <img src="/logo.png" alt="Tureggon" className="w-56 drop-shadow-xl" />
        <p className="text-white/90 text-lg font-medium mt-3 tracking-wide">
          Plataforma Inteligente Tureggon
        </p>
      </div>

      {/* CONTAINER PRINCIPAL */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-white/20 backdrop-blur-md animate-slide-up">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
          Consultas Automotivas
        </h2>

        {/* CONSULTA POR PLACA */}
        <div className="space-y-2 mb-6">
          <Label className="font-semibold text-gray-700">Consulta pela Placa</Label>
          <div className="flex gap-2">
            <Input
              placeholder="ABC1D23"
              className="uppercase text-lg h-12"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
            />
            <Button className="bg-black text-white hover:bg-gray-800 h-12 px-6 flex items-center gap-2 rounded-xl">
              <Search size={20} />
            </Button>
          </div>
        </div>

        {/* SELECT MARCA */}
        <div className="space-y-2 mb-4">
          <Label className="font-semibold text-gray-700">Marca do veículo</Label>
          <Select onValueChange={setSelectedBrand}>
            <SelectTrigger className="h-12 text-lg rounded-xl">
              <SelectValue placeholder="Selecione a marca" />
            </SelectTrigger>
            <SelectContent>
              {vehicleBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SELECT ESTADO */}
        <div className="space-y-2 mb-4">
          <Label className="font-semibold text-gray-700">Estado</Label>
          <Select onValueChange={handleStateChange}>
            <SelectTrigger className="h-12 text-lg rounded-xl">
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {brazilStates.map((uf) => (
                <SelectItem key={uf} value={uf}>
                  {uf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SELECT CIDADE */}
        <div className="space-y-2 mb-6">
          <Label className="font-semibold text-gray-700">Cidade</Label>
          <Select onValueChange={setSelectedCity}>
            <SelectTrigger className="h-12 text-lg rounded-xl">
              <SelectValue placeholder="Selecione a cidade" />
            </SelectTrigger>
            <SelectContent>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* BOTÃO */}
        <Button className="w-full bg-black text-white text-lg font-semibold h-14 rounded-2xl shadow-xl hover:bg-gray-900 transition-all">
          Buscar Oficinas Próximas
        </Button>
      </div>

      {/* SERVIÇOS */}
      <div className="text-white mt-12 text-center animate-fade-in">
        <p className="text-2xl font-semibold">Serviços disponíveis</p>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <Card className="w-32 h-28 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center border border-white/30">
            <Car size={26} className="text-black" />
            <span className="font-medium mt-2">Diagnóstico</span>
          </Card>

          <Card className="w-32 h-28 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center border border-white/30">
            <Wrench size={26} className="text-black" />
            <span className="font-medium mt-2">Revisão</span>
          </Card>

          <Card className="w-32 h-28 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center border border-white/30">
            <Star size={26} className="text-black" />
            <span className="font-medium mt-2">Avaliações</span>
          </Card>

          <Card className="w-32 h-28 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center border border-white/30">
            <Phone size={26} className="text-black" />
            <span className="font-medium mt-2">Contato</span>
          </Card>
        </div>
      </div>
    </main>
  );
}
