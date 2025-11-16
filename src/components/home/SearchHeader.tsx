import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { VEHICLE_BRANDS } from "@/lib/vehicle-brands";
import { Search, MapPin, List } from "lucide-react";

type Props = {
  mode: "placa" | "manual" | "oficinas";
  onModeChange: (mode: "placa" | "manual" | "oficinas") => void;
};

export default function SearchHeader({ mode, onModeChange }: Props) {
  const [plate, setPlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engine, setEngine] = useState("");

  const modelosFake = ["Sandero", "Gol", "Civic", "Corolla"];
  const anosFake = ["2015", "2018", "2020", "2024"];
  const motoresFake = ["1.0", "1.3", "1.6", "2.0"];

  const isManual = mode === "manual";

  return (
    <header className="bg-[#00B8FF] text-white pt-4 pb-6 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 space-y-4">
        {/* LOGO + BOTÃO SISTEMA ONLINE */}
        <div className="flex items-center justify-between">
          <img
            src="/logo.png"
            alt="Tureggon Store"
            className="h-10 w-auto"
          />
          <button className="px-4 py-1 rounded-full border border-white/60 bg-white/10 text-sm font-semibold hover:bg-white/20 transition">
            Sistema Online
          </button>
        </div>

        {/* ABAS: BUSCAR POR PLACA / SEM PLACA / OFICINAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          <button
            onClick={() => onModeChange("placa")}
            className={`flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition
              ${
                mode === "placa"
                  ? "bg-white text-gray-900"
                  : "bg-white/15 text-white/80"
              }`}
          >
            <Search size={18} />
            Buscar por Placa
          </button>

          <button
            onClick={() => onModeChange("manual")}
            className={`flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition
              ${
                mode === "manual"
                  ? "bg-white text-gray-900"
                  : "bg-white/15 text-white/80"
              }`}
          >
            <List size={18} />
            Buscar sem Placa
          </button>

          <button
            onClick={() => onModeChange("oficinas")}
            className={`flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition
              ${
                mode === "oficinas"
                  ? "bg-white text-gray-900"
                  : "bg-white/15 text-white/80"
              }`}
          >
            <MapPin size={18} />
            Oficinas Próximas
          </button>
        </div>

        {/* INPUT DE PLACA + BOTÃO BUSCAR */}
        <div className="flex flex-col md:flex-row gap-3 mt-2">
          <div className="flex-1">
            <Input
              placeholder="Digite a placa (ex: ABC1234)"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              disabled={mode !== "placa"}
              className={`h-11 rounded-xl border-2 bg-white/5 text-white placeholder:text-white/60
                ${
                  mode === "placa"
                    ? "border-white/70"
                    : "border-white/20 opacity-70"
                }`}
            />
          </div>
          <Button
            className="h-11 px-6 rounded-xl bg-white/90 text-[#0F172A] font-semibold hover:bg-white"
          >
            <Search size={18} className="mr-2" />
            Buscar
          </Button>
        </div>

        {/* SELECTS: MARCA / MODELO / ANO / MOTOR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {/* Marca */}
          <Select
            value={brand}
            onValueChange={setBrand}
            disabled={!isManual}
          >
            <SelectTrigger
              className={`h-10 rounded-xl bg-white/10 border-0 text-sm
                ${!isManual ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_BRANDS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Modelo */}
          <Select
            value={model}
            onValueChange={setModel}
            disabled={!isManual}
          >
            <SelectTrigger
              className={`h-10 rounded-xl bg-white/10 border-0 text-sm
                ${!isManual ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <SelectValue placeholder="Modelo" />
            </SelectTrigger>
            <SelectContent>
              {modelosFake.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Ano */}
          <Select
            value={year}
            onValueChange={setYear}
            disabled={!isManual}
          >
            <SelectTrigger
              className={`h-10 rounded-xl bg-white/10 border-0 text-sm
                ${!isManual ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {anosFake.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Motor */}
          <Select
            value={engine}
            onValueChange={setEngine}
            disabled={!isManual}
          >
            <SelectTrigger
              className={`h-10 rounded-xl bg-white/10 border-0 text-sm
                ${!isManual ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <SelectValue placeholder="Motor" />
            </SelectTrigger>
            <SelectContent>
              {motoresFake.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
