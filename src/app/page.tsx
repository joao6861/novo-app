"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

import { VEHICLE_BRANDS } from "@/lib/vehicle-brands";
import { brazilStates, getCitiesByState } from "@/lib/brazil-locations";

import {
  Search,
  MapPin,
  Car,
  Star,
  Home
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("consulta");

  const [plate, setPlate] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [cities, setCities] = useState<string[]>([]);

  const handleStateChange = (uf: string) => {
    setSelectedState(uf);
    const list = getCitiesByState(uf);
    setCities(list);
  };

  return (
    <main className="min-h-screen bg-[#00B8FF] p-4">
      {/* ======================= TOP MENU ======================= */}
      <div className="w-full flex justify-around bg-white rounded-3xl shadow-xl py-4 mb-6">
        <button
          className={`flex flex-col items-center ${
            activeTab === "consulta" ? "text-black font-bold" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("consulta")}
        >
          <Home size={26} />
          Consulta
        </button>

        <button
          className={`flex flex-col items-center ${
            activeTab === "oficinas" ? "text-black font-bold" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("oficinas")}
        >
          <MapPin size={26} />
          Oficinas
        </button>

        <button
          className={`flex flex-col items-center ${
            activeTab === "veiculos" ? "text-black font-bold" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("veiculos")}
        >
          <Car size={26} />
          Veículos
        </button>

        <button
          className={`flex flex-col items-center ${
            activeTab === "avaliacoes" ? "text-black font-bold" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("avaliacoes")}
        >
          <Star size={26} />
          Avaliações
        </button>
      </div>

      {/* ======================= CONTEÚDO ======================= */}
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ======================= ABA CONSULTA ======================= */}
        {activeTab === "consulta" && (
          <Card className="p-6 bg-white rounded-3xl shadow-xl space-y-4">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Consultas Automotivas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Consulta pela placa */}
              <div>
                <Label>Consulta pela Placa</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="ABC1D23"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  />
                  <Button className="bg-black text-white">
                    <Search size={20} />
                  </Button>
                </div>
              </div>

              {/* Marca */}
              <div>
                <Label>Marca do veículo</Label>
                <Select onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_BRANDS.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Estado */}
              <div>
                <Label>Estado</Label>
                <Select onValueChange={handleStateChange}>
                  <SelectTrigger>
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

              {/* Cidade */}
              <div>
                <Label>Cidade</Label>
                <Select onValueChange={setSelectedCity} disabled={!selectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ======================= ABA OFICINAS ======================= */}
        {activeTab === "oficinas" && (
          <Card className="p-6 bg-white rounded-3xl shadow-xl space-y-4">
            <h2 className="text-2xl font-bold text-center">Oficinas Próximas</h2>

            <p className="text-gray-600 text-center">
              Busque oficinas autorizadas e especializadas na sua região.
            </p>

            <div className="text-center pt-4">
              <MapPin size={40} className="mx-auto text-red-500" />
            </div>
          </Card>
        )}

        {/* ======================= ABA VEÍCULOS ======================= */}
        {activeTab === "veiculos" && (
          <Card className="p-6 bg-white rounded-3xl shadow-xl space-y-4">
            <h2 className="text-2xl font-bold text-center">Meus Veículos</h2>

            <p className="text-gray-600 text-center">
              Em breve: histórico de consultas, veículos salvos e muito mais.
            </p>

            <div className="text-center pt-4">
              <Car size={40} className="mx-auto text-blue-600" />
            </div>
          </Card>
        )}

        {/* ======================= ABA AVALIAÇÕES ======================= */}
        {activeTab === "avaliacoes" && (
          <Card className="p-6 bg-white rounded-3xl shadow-xl space-y-4">
            <h2 className="text-2xl font-bold text-center">Avaliações de Oficinas</h2>

            <p className="text-gray-600 text-center">
              Em breve você poderá avaliar oficinas e ver notas de clientes reais.
            </p>

            <div className="flex justify-center pt-4">
              <Star size={40} className="text-yellow-500" />
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
