// Tipos e interfaces para o sistema de oficinas

export interface Oficina {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  especialidades: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  oficinaId: string;
  role: "oficina" | "admin";
  createdAt: Date;
}

export interface Agendamento {
  id: string;
  oficinaId: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone: string;
  veiculoMarca: string;
  veiculoModelo: string;
  veiculoAno: number;
  veiculoPlaca: string;
  servicoTipo: string;
  servicoDescricao: string;
  dataAgendamento: Date;
  horaAgendamento: string;
  status: "pendente" | "confirmado" | "em_andamento" | "concluido" | "cancelado";
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notificacao {
  id: string;
  oficinaId: string;
  tipo: "novo_agendamento" | "cancelamento" | "alteracao";
  titulo: string;
  mensagem: string;
  agendamentoId?: string;
  lida: boolean;
  createdAt: Date;
}

export interface RelatorioData {
  periodo: {
    inicio: Date;
    fim: Date;
  };
  totalAgendamentos: number;
  agendamentosPorStatus: {
    pendente: number;
    confirmado: number;
    em_andamento: number;
    concluido: number;
    cancelado: number;
  };
  agendamentosPorServico: {
    [key: string]: number;
  };
  agendamentosPorMes: {
    mes: string;
    total: number;
  }[];
}

export type StatusAgendamento = Agendamento["status"];
export type TipoNotificacao = Notificacao["tipo"];
