"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import {
  Car,
  Wrench,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  Star,
} from "lucide-react";

import { VEHICLE_BRANDS } from "@/lib/vehicle-brands"; // CORRIGIDO
import { brazilStates, getCitiesByState } from "@/lib/brazil-locations";

export default function Home() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const handleStateChange = (stateValue: string) => {
    setSelectedState(stateValue);
    setSelectedCity("");
    const cities = getCitiesByState(stateValue);
    setAvailableCities(cities);
  };

  // Oficinas de exemplo
  const workshops = [
    {
      id: 1,
      name: "Auto Center Premium",
      rating: 4.8,
      distance: "2.5 km",
      address: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      phone: "(11) 98765-4321",
      specialties: ["Mecânica Geral", "Elétrica", "Funilaria"],
    },
    {
      id: 2,
      name: "Oficina Rápida Express",
      rating: 4.6,
      distance: "3.8 km",
      address: "Av. Principal, 456",
      city: "São Paulo",
      state: "SP",
      phone: "(11) 91234-5678",
      specialties: ["Troca de Óleo", "Revisão", "Alinhamento"],
    },
    {
      id: 3,
      name: "Mecânica do João",
      rating: 4.9,
      distance: "1.2 km",
      address: "Rua dos Mecânicos, 789",
      city: "Campinas",
      state: "SP",
      phone: "(19) 99876-5432",
      specialties: ["Motor", "Suspensão", "Freios"],
    },
    {
      id: 4,
      name: "Centro Automotivo Silva",
      rating: 4.7,
      distance: "4.5 km",
      address: "Av. dos Estados, 321",
      city: "Rio de Janeiro",
      state: "RJ",
      phone: "(21) 98888-7777",
      specialties: [
        "Diagnóstico",
        "Injeção Eletrônica",
        "Ar Condicionado",
      ],
    },
  ];

  const filteredWorkshops = workshops.filter((workshop) => {
    if (selectedState && workshop.state !== selectedState) return false;
    if (selectedCity && workshop.city !== selectedCity) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AutoCare
                </h1>
                <p className="text-sm text-gray-600">
                  Sua oficina ideal a um clique
                </p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Phone className="w-4 h-4 mr-2" />
              Contato
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Encontre a Oficina Perfeita para seu{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Veículo
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Conectamos você com oficinas qualificadas da sua região.
          </p>
        </div>

        {/* Busca */}
        <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Wrench className="w-6 h-6 text-blue-600" />
              Buscar Oficina
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* CORRIGIDO */}
              <div className="space-y-2">
                <Label htmlFor="brand">Marca do Veículo</Label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger id="brand">
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

              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input id="model" placeholder="Ex: Civic, Gol, Corolla..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Ano</Label>
                <Input id="year" type="number" placeholder="Ex: 2020" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Tipo de Serviço</Label>
                <Select>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mecanica">Mecânica Geral</SelectItem>
                    <SelectItem value="eletrica">Elétrica</SelectItem>
                    <SelectItem value="funilaria">Funilaria</SelectItem>
                    <SelectItem value="pintura">Pintura</SelectItem>
                    <SelectItem value="revisao">Revisão</SelectItem>
                    <SelectItem value="oleo">Troca de Óleo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6">
              <MapPin className="w-5 h-5 mr-2" />
              Buscar Oficinas Próximas
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Oficinas Próximas */}
      <section className="container mx-auto px-4 py-12">

        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            Oficinas Próximas
          </h3>
          <p className="text-gray-600">
            Selecione o estado e cidade para filtrar
          </p>
        </div>

        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label htmlFor="state" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Estado
                </Label>
                <Select value={selectedState} onValueChange={handleStateChange}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {brazilStates.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  Cidade
                </Label>
                <Select
                  value={selectedCity}
                  onValueChange={setSelectedCity}
                  disabled={!selectedState}
                >
                  <SelectTrigger id="city">
                    <SelectValue
                      placeholder={
                        selectedState
                          ? "Selecione a cidade"
                          : "Primeiro selecione o estado"
                      }
                    />
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

            </div>
          </CardContent>
        </Card>

        {/* Lista */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkshops.length > 0 ? (
            filteredWorkshops.map((workshop) => (
              <Card
                key={workshop.id}
                className="hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {workshop.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{workshop.distance}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold">{workshop.rating}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {workshop.address} - {workshop.city}/
                        {workshop.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{workshop.phone}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Especialidades:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {workshop.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Ligar
                    </Button>
                  </div>

                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                Nenhuma oficina encontrada
              </h4>
              <p className="text-gray-600">
                {selectedState
                  ? "Tente selecionar outra cidade"
                  : "Selecione um estado para ver as oficinas"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Agendamento Rápido</h3>
              <p className="text-gray-600">
                Agende seu serviço rapidamente e sem complicação.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="pt-6">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Oficinas Verificadas</h3>
              <p className="text-gray-600">
                Oficinas avaliadas e testadas por clientes reais.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100">
            <CardContent className="pt-6">
              <div className="bg-gradient-to-br from-pink-600 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Suporte Dedicado</h3>
              <p className="text-gray-600">
                Atendimento rápido, humano e sempre disponível.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">AutoCare</h3>
          </div>

          <p className="text-gray-400 mb-4">
            Conectando você às melhores oficinas do Brasil
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white">Sobre</a>
            <a href="#" className="hover:text-white">Termos</a>
            <a href="#" className="hover:text-white">Privacidade</a>
            <a href="#" className="hover:text-white">Contato</a>
          </div>

          <p className="text-gray-500 text-sm mt-6">
            © 2024 AutoCare. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}
