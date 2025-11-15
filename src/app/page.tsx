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
  const [showResults, setShowResults] = useState(false);

  const handleStateChange = (uf: string) => {
    setSelectedState(uf);
    setAvailableCities(getCitiesByState(uf));
  };

  const fakePlateResult = {
    modelo: "Sandero 1.0 SCe",
    ano: "2020",
    cor: "Branco",
    combustivel: "Flex",
    municipio: "Curitiba",
    uf: "PR",
  };

  return (
    <main className="min-h-screen bg-[#00B8FF] w-full flex flex-col items-center py-10 px-4 pb-28">

      {/* HEADER */}
      <div className="flex flex-col items-center mb-8 animate-fade-in">
        <img src="/logo.png" alt="Tureggon" className="w-56 drop-shadow-xl" />
        <p className="text-white/90 text-lg font-medium mt-3 tracking-wide">
          Plataforma Inteligente Tureggon
        </p>
      </div>

      {/* SEÇÃO PRINCIPAL OU RESULTADOS */}
      {!showResults && (
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
              <Button onClick={() => setShowResults(true)} className="bg-black text-white hover:bg-gray-800 h-12 px-6 flex items-center gap-2 rounded-xl">
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

          <Button className="w-full bg-black text-white text-lg font-semibold h-14 rounded-2xl shadow-xl hover:bg-gray-900 transition-all">
            Buscar Oficinas Próximas
          </Button>
        </div>
      )}

      {/* TELA DE RESULTADOS DA CONSULTA */}
      {showResults && (
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 animate-slide-up border border-white/30">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Resultado da Consulta
          </h2>

          <Card className="p-4 border border-gray-200 rounded-2xl mb-4">
            <p className="text-gray-700 text-lg font-semibold">{plate}</p>
            <p className="text-gray-600">Modelo: {fakePlateResult.modelo}</p>
            <p className="text-gray-600">Ano: {fakePlateResult.ano}</p>
            <p className="text-gray-600">Cor: {fakePlateResult.cor}</p>
            <p className="text-gray-600">Combustível: {fakePlateResult.combustivel}</p>
            <p className="text-gray-600">Local: {fakePlateResult.municipio} - {fakePlateResult.uf}</p>
          </Card>

          <Button onClick={() => setShowResults(false)} className="w-full bg-black text-white h-12 rounded-xl mt-4 hover:bg-gray-900">
            Nova Consulta
          </Button>
        </div>
      )}

      {/* MENU INFERIOR */}
      <nav className="fixed bottom-0 left-0 w-full bg-white h-20 shadow-xl border-t border-gray-200 flex justify-around items-center">
        <button className="flex flex-col items-center text-gray-700">
          <Search size={24} />
          <span className="text-xs">Consultar</span>
        </button>

        <button className="flex flex-col items-center text-gray-700">
          <MapPin size={24} />
          <span className="text-xs">Oficinas</span>
        </button>

        <button className="flex flex-col items-center text-gray-700">
          <Car size={24} />
          <span className="text-xs">Veículos</span>
        </button>

        <button className="flex flex-col items-center text-gray-700">
          <Star size={24} />
          <span className="text-xs">Avaliações</span>
        </button>
      </nav>
    </main>
  );
}
