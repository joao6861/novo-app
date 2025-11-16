"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, Building2, Mail, Phone, MapPin, FileText, Lock, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { brazilStates, getCitiesByState } from "@/lib/brazil-locations";

export default function RegistroOficina() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    nomeOficina: "",
    cnpj: "",
    email: "",
    telefone: "",
    cep: "",
    endereco: "",
    estado: "",
    cidade: "",
    senha: "",
    confirmarSenha: "",
    especialidades: [] as string[],
  });

  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const handleStateChange = (stateValue: string) => {
    setFormData({ ...formData, estado: stateValue, cidade: "" });
    const cities = getCitiesByState(stateValue);
    setAvailableCities(cities);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres");
      setLoading(false);
      return;
    }

    // Simulação de registro (substituir por API real)
    setTimeout(() => {
      setSucesso(true);
      setLoading(false);
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push("/oficina/login");
      }, 2000);
    }, 1500);
  };

  const especialidadesDisponiveis = [
    "Mecânica Geral",
    "Elétrica",
    "Funilaria",
    "Pintura",
    "Revisão",
    "Troca de Óleo",
    "Alinhamento e Balanceamento",
    "Suspensão",
    "Freios",
    "Motor",
    "Ar Condicionado",
    "Injeção Eletrônica",
  ];

  const toggleEspecialidade = (esp: string) => {
    setFormData({
      ...formData,
      especialidades: formData.especialidades.includes(esp)
        ? formData.especialidades.filter((e) => e !== esp)
        : [...formData.especialidades, esp],
    });
  };

  if (sucesso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur">
          <CardContent className="pt-6 text-center">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Cadastro Realizado!
            </h2>
            <p className="text-gray-600 mb-6">
              Sua oficina foi cadastrada com sucesso. Você será redirecionado para a página de login.
            </p>
            <div className="animate-pulse text-sm text-gray-500">
              Redirecionando...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="w-full max-w-3xl mx-auto">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl">
              <Car className="w-10 h-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AutoCare
              </h1>
              <p className="text-sm text-gray-600">Cadastro de Oficina</p>
            </div>
          </div>
        </div>

        {/* Card de Registro */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Cadastre sua Oficina
            </CardTitle>
            <CardDescription className="text-center">
              Preencha os dados abaixo para começar a receber agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {erro && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{erro}</span>
                </div>
              )}

              {/* Dados da Oficina */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Dados da Oficina
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="nomeOficina">Nome da Oficina *</Label>
                    <Input
                      id="nomeOficina"
                      placeholder="Ex: Auto Center Premium"
                      value={formData.nomeOficina}
                      onChange={(e) => setFormData({ ...formData, nomeOficina: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Endereço
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      value={formData.cep}
                      onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado *</Label>
                    <Select value={formData.estado} onValueChange={handleStateChange}>
                      <SelectTrigger id="estado">
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
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Select
                      value={formData.cidade}
                      onValueChange={(value) => setFormData({ ...formData, cidade: value })}
                      disabled={!formData.estado}
                    >
                      <SelectTrigger id="cidade">
                        <SelectValue
                          placeholder={
                            formData.estado
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

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="endereco">Endereço Completo *</Label>
                    <Input
                      id="endereco"
                      placeholder="Rua, número, bairro"
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Especialidades */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Especialidades
                </h3>
                <p className="text-sm text-gray-600">
                  Selecione os serviços que sua oficina oferece
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {especialidadesDisponiveis.map((esp) => (
                    <button
                      key={esp}
                      type="button"
                      onClick={() => toggleEspecialidade(esp)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.especialidades.includes(esp)
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {esp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Acesso */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <Lock className="w-5 h-5 text-purple-600" />
                  Dados de Acesso
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="oficina@exemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha *</Label>
                    <Input
                      id="senha"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.senha}
                      onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      placeholder="Digite a senha novamente"
                      value={formData.confirmarSenha}
                      onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar Oficina"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link
                  href="/oficina/login"
                  className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
                >
                  Fazer login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Link para voltar ao site */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
          >
            ← Voltar para o site principal
          </Link>
        </div>
      </div>
    </div>
  );
}
