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
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Filter,
  Bell,
  LogOut,
  BarChart3,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { Agendamento, StatusAgendamento } from "@/lib/types/oficina";

export default function DashboardOficina() {
  const [filtroStatus, setFiltroStatus] = useState<StatusAgendamento | "todos">("todos");
  const [filtroData, setFiltroData] = useState("");
  const [filtroVeiculo, setFiltroVeiculo] = useState("");
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(3);

  // Dados mockados (substituir por dados reais da API)
  const oficinaInfo = {
    nome: "Auto Center Premium",
    cidade: "São Paulo",
    estado: "SP",
  };

  const agendamentosMock: Agendamento[] = [
    {
      id: "1",
      oficinaId: "oficina-1",
      clienteNome: "João Silva",
      clienteEmail: "joao@email.com",
      clienteTelefone: "(11) 98765-4321",
      veiculoMarca: "Honda",
      veiculoModelo: "Civic",
      veiculoAno: 2020,
      veiculoPlaca: "ABC-1234",
      servicoTipo: "Revisão",
      servicoDescricao: "Revisão completa dos 30.000 km",
      dataAgendamento: new Date("2024-01-15"),
      horaAgendamento: "09:00",
      status: "pendente",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      oficinaId: "oficina-1",
      clienteNome: "Maria Santos",
      clienteEmail: "maria@email.com",
      clienteTelefone: "(11) 91234-5678",
      veiculoMarca: "Toyota",
      veiculoModelo: "Corolla",
      veiculoAno: 2021,
      veiculoPlaca: "XYZ-5678",
      servicoTipo: "Troca de Óleo",
      servicoDescricao: "Troca de óleo e filtros",
      dataAgendamento: new Date("2024-01-15"),
      horaAgendamento: "14:00",
      status: "confirmado",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      oficinaId: "oficina-1",
      clienteNome: "Pedro Oliveira",
      clienteEmail: "pedro@email.com",
      clienteTelefone: "(11) 99876-5432",
      veiculoMarca: "Volkswagen",
      veiculoModelo: "Gol",
      veiculoAno: 2019,
      veiculoPlaca: "DEF-9012",
      servicoTipo: "Mecânica Geral",
      servicoDescricao: "Verificar barulho no motor",
      dataAgendamento: new Date("2024-01-16"),
      horaAgendamento: "10:30",
      status: "em_andamento",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const [agendamentos, setAgendamentos] = useState(agendamentosMock);

  // Filtrar agendamentos
  const agendamentosFiltrados = agendamentos.filter((ag) => {
    if (filtroStatus !== "todos" && ag.status !== filtroStatus) return false;
    if (filtroVeiculo && !ag.veiculoModelo.toLowerCase().includes(filtroVeiculo.toLowerCase())) return false;
    return true;
  });

  // Estatísticas
  const stats = {
    total: agendamentos.length,
    pendentes: agendamentos.filter((a) => a.status === "pendente").length,
    confirmados: agendamentos.filter((a) => a.status === "confirmado").length,
    emAndamento: agendamentos.filter((a) => a.status === "em_andamento").length,
    concluidos: agendamentos.filter((a) => a.status === "concluido").length,
  };

  const getStatusIcon = (status: StatusAgendamento) => {
    switch (status) {
      case "pendente":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "confirmado":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case "em_andamento":
        return <PlayCircle className="w-5 h-5 text-purple-600" />;
      case "concluido":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "cancelado":
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: StatusAgendamento) => {
    const styles = {
      pendente: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmado: "bg-blue-100 text-blue-800 border-blue-300",
      em_andamento: "bg-purple-100 text-purple-800 border-purple-300",
      concluido: "bg-green-100 text-green-800 border-green-300",
      cancelado: "bg-red-100 text-red-800 border-red-300",
    };

    const labels = {
      pendente: "Pendente",
      confirmado: "Confirmado",
      em_andamento: "Em Andamento",
      concluido: "Concluído",
      cancelado: "Cancelado",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const handleStatusChange = (agendamentoId: string, novoStatus: StatusAgendamento) => {
    setAgendamentos(
      agendamentos.map((ag) =>
        ag.id === agendamentoId ? { ...ag, status: novoStatus, updatedAt: new Date() } : ag
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {oficinaInfo.nome}
                </h1>
                <p className="text-sm text-gray-600">
                  {oficinaInfo.cidade} - {oficinaInfo.estado}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notificacoesNaoLidas > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {notificacoesNaoLidas}
                  </span>
                )}
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Link href="/oficina/login">
                <Button variant="outline" size="icon">
                  <LogOut className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
                </div>
                <Calendar className="w-10 h-10 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pendentes</p>
                  <p className="text-3xl font-bold text-yellow-700">{stats.pendentes}</p>
                </div>
                <AlertCircle className="w-10 h-10 text-yellow-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Confirmados</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.confirmados}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Em Andamento</p>
                  <p className="text-3xl font-bold text-purple-700">{stats.emAndamento}</p>
                </div>
                <PlayCircle className="w-10 h-10 text-purple-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Concluídos</p>
                  <p className="text-3xl font-bold text-green-700">{stats.concluidos}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filtro-status">Status</Label>
                <Select value={filtroStatus} onValueChange={(value: any) => setFiltroStatus(value)}>
                  <SelectTrigger id="filtro-status">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filtro-data">Data</Label>
                <Input
                  id="filtro-data"
                  type="date"
                  value={filtroData}
                  onChange={(e) => setFiltroData(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filtro-veiculo">Veículo</Label>
                <Input
                  id="filtro-veiculo"
                  placeholder="Buscar por modelo..."
                  value={filtroVeiculo}
                  onChange={(e) => setFiltroVeiculo(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Agendamentos */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Agendamentos ({agendamentosFiltrados.length})
              </CardTitle>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                Relatórios
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agendamentosFiltrados.length > 0 ? (
                agendamentosFiltrados.map((agendamento) => (
                  <Card key={agendamento.id} className="border-2 hover:shadow-lg transition-all">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* Informações do Cliente */}
                        <div className="lg:col-span-3 space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(agendamento.status)}
                            <h4 className="font-semibold text-gray-900">{agendamento.clienteNome}</h4>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{agendamento.clienteTelefone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{agendamento.clienteEmail}</span>
                            </div>
                          </div>
                        </div>

                        {/* Informações do Veículo */}
                        <div className="lg:col-span-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <Car className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold text-gray-900">
                              {agendamento.veiculoMarca} {agendamento.veiculoModelo}
                            </h4>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>Ano: {agendamento.veiculoAno}</p>
                            <p>Placa: {agendamento.veiculoPlaca}</p>
                          </div>
                        </div>

                        {/* Serviço e Data */}
                        <div className="lg:col-span-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-purple-600" />
                            <h4 className="font-semibold text-gray-900">{agendamento.servicoTipo}</h4>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{agendamento.dataAgendamento.toLocaleDateString("pt-BR")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{agendamento.horaAgendamento}</span>
                            </div>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="lg:col-span-3 flex flex-col gap-2">
                          {getStatusBadge(agendamento.status)}
                          <Select
                            value={agendamento.status}
                            onValueChange={(value: StatusAgendamento) =>
                              handleStatusChange(agendamento.id, value)
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Alterar status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pendente">Pendente</SelectItem>
                              <SelectItem value="confirmado">Confirmar</SelectItem>
                              <SelectItem value="em_andamento">Iniciar</SelectItem>
                              <SelectItem value="concluido">Concluir</SelectItem>
                              <SelectItem value="cancelado">Cancelar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {agendamento.servicoDescricao && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Descrição:</span> {agendamento.servicoDescricao}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">
                    Nenhum agendamento encontrado
                  </h4>
                  <p className="text-gray-600">
                    Ajuste os filtros ou aguarde novos agendamentos
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
