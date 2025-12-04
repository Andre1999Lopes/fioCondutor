import { apiClient } from './client';

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  endereco: string;
  observacoes?: string;
}

export interface Turma {
  id: number;
  nome: string;
  descricao: string;
  horario: string;
  diasSemana: string;
  instrutorId?: number;
  capacidadeMaxima: number;
  ativa: boolean;
}

export interface Matricula {
  id: number;
  alunoId: number;
  turmaId: number;
  dataMatricula: string;
  ativa: boolean;
}

export interface Pagamento {
  id: number;
  alunoId: number;
  valor: number;
  dataPagamento: string;
  dataVencimento: string;
  status: 'pago' | 'pendente' | 'vencido';
  descricao: string;
}

export interface User {
  id: number;
  nome: string;
  email: string;
}

export const alunosApi = {
  getAll: () => apiClient.get<Aluno[]>('/alunos'),
  getById: (id: number) => apiClient.get<Aluno>(`/alunos/${id}`),
  create: (data: Partial<Aluno>) => apiClient.post<Aluno>('/alunos', data),
  update: (id: number, data: Partial<Aluno>) => apiClient.put<Aluno>(`/alunos/${id}`, data),
  delete: (id: number) => apiClient.delete(`/alunos/${id}`)
};

export const turmasApi = {
  getAll: async () => {
    const res = await apiClient.get<any[]>('/turmas');
    const data = res.data.map((t: any) => ({
      id: t.id,
      nome: t.nome,
      descricao: t.descricao ?? '',
      horario: t.horario,
      diasSemana: t.diasSemana ?? t.dias_semana,
      capacidadeMaxima: t.capacidadeMaxima ?? t.vagas_totais,
      ativa: typeof t.ativa === 'boolean' ? t.ativa : ((t.status ?? 'Ativa') === 'Ativa'),
    })) as Turma[];
    return { ...res, data } as unknown as { data: Turma[] };
  },
  getById: async (id: number) => {
    const res = await apiClient.get<any>(`/turmas/${id}`);
    const t = res.data;
    const data: Turma = {
      id: t.id,
      nome: t.nome,
      descricao: t.descricao ?? '',
      horario: t.horario,
      diasSemana: t.diasSemana ?? t.dias_semana,
      capacidadeMaxima: t.capacidadeMaxima ?? t.vagas_totais,
      ativa: typeof t.ativa === 'boolean' ? t.ativa : ((t.status ?? 'Ativa') === 'Ativa'),
    };
    return { ...res, data } as unknown as { data: Turma };
  },
  create: (data: any) =>
    apiClient.post<Turma>('/turmas', {
      nome: data.nome,
      dias_semana: data.diasSemana,
      horario: data.horario,
      vagas_totais: data.capacidadeMaxima,
      status: data.ativa === false ? 'Inativa' : 'Ativa',
    }),
  update: (id: number, data: any) =>
    apiClient.put<Turma>(`/turmas/${id}`, {
      nome: data.nome,
      dias_semana: data.diasSemana,
      horario: data.horario,
      vagas_totais: data.capacidadeMaxima,
      status: data.ativa === false ? 'Inativa' : 'Ativa',
    }),
  delete: (id: number) => apiClient.delete(`/turmas/${id}`)
};

export const matriculasApi = {
  getAll: async () => {
    const res = await apiClient.get<any[]>('/matriculas');
    const data = res.data.map((m: any) => ({
      id: m.id,
      alunoId: m.alunoId,
      turmaId: m.turmaId,
      dataMatricula: m.dataMatricula ?? m.data_matricula,
      ativa: typeof m.ativa === 'boolean' ? m.ativa : true,
      alunoNome: m.aluno?.nome,
      turmaNome: m.turma?.nome,
    })) as Matricula[];
    return { ...res, data } as unknown as { data: Matricula[] };
  },
  create: (data: any) => apiClient.post<Matricula>('/matriculas', data),
  delete: (id: number) => apiClient.delete(`/matriculas/${id}`),
  getByTurma: async (turmaId: number) => {
    const res = await apiClient.get<any[]>(`/matriculas/turma/${turmaId}`);
    const data = res.data.map((m: any) => ({
      id: m.id,
      alunoId: m.alunoId,
      turmaId: m.turmaId,
      dataMatricula: m.dataMatricula ?? m.data_matricula,
      ativa: typeof m.ativa === 'boolean' ? m.ativa : true,
      alunoNome: m.aluno?.nome,
      turmaNome: m.turma?.nome,
    })) as Matricula[];
    return { ...res, data } as unknown as { data: Matricula[] };
  }
};

export const pagamentosApi = {
  getAll: async () => {
    const res = await apiClient.get<any[]>('/pagamentos');
    const data = res.data.map((p: any) => ({
      id: p.id,
      alunoId: p.alunoId,
      valor: Number(p.valor),
      dataPagamento: p.dataPagamento ?? p.data_pagamento,
      dataVencimento: p.dataVencimento ?? p.data_vencimento,
      status: (p.status ?? 'pendente').toLowerCase(),
      descricao: p.descricao ?? p.mes_referencia ?? '',
    })) as Pagamento[];
    return { ...res, data } as unknown as { data: Pagamento[] };
  },
  create: (data: any) => apiClient.post<Pagamento>('/pagamentos', {
    alunoId: data.alunoId,
    planoId: data.planoId,
    status: data.status ?? 'pendente',
    data_pagamento: data.status === 'pago' ? data.dataPagamento : null,
    data_vencimento: data.dataVencimento,
    mes_referencia: data.descricao,
  }),
  updateStatus: (id: number, status: string) => apiClient.put(`/pagamentos/${id}/status`, { status }),
  getByAluno: async (alunoId: number) => {
    const res = await apiClient.get<any[]>(`/pagamentos/aluno/${alunoId}`);
    const data = res.data.map((p: any) => ({
      id: p.id,
      alunoId: p.alunoId,
      valor: Number(p.valor),
      dataPagamento: p.dataPagamento ?? p.data_pagamento,
      dataVencimento: p.dataVencimento ?? p.data_vencimento,
      status: (p.status ?? 'pendente').toLowerCase(),
      descricao: p.descricao ?? p.mes_referencia ?? '',
    })) as Pagamento[];
    return { ...res, data } as unknown as { data: Pagamento[] };
  },
  getAtrasados: async () => {
    const res = await apiClient.get<any[]>('/pagamentos/atrasados');
    const data = res.data.map((p: any) => ({
      id: p.id,
      alunoId: p.alunoId,
      valor: Number(p.valor),
      dataPagamento: p.dataPagamento ?? p.data_pagamento,
      dataVencimento: p.dataVencimento ?? p.data_vencimento,
      status: (p.status ?? 'pendente').toLowerCase(),
      descricao: p.descricao ?? p.mes_referencia ?? '',
    })) as Pagamento[];
    return { ...res, data } as unknown as { data: Pagamento[] };
  },
  delete: (id: number) => apiClient.delete(`/pagamentos/${id}`)
};

export const planosApi = {
  getAll: async () => {
    const res = await apiClient.get<any[]>('/planos');
    const data = res.data.map((p: any) => ({
      id: p.id,
      nome: p.nome,
      descricao: p.descricao ?? '',
      valor: Number(p.valor),
      duracao: p.duracao ?? 0,
      ativo: p.ativo ?? true,
    }));
    return { ...res, data } as unknown as { data: any[] };
  },
  getById: async (id: number) => {
    const res = await apiClient.get<any>(`/planos/${id}`);
    const p = res.data;
    const data = {
      id: p.id,
      nome: p.nome,
      descricao: p.descricao ?? '',
      valor: Number(p.valor),
      duracao: p.duracao ?? 0,
      ativo: p.ativo ?? true,
    };
    return { ...res, data } as unknown as { data: any };
  },
  create: (data: any) => {
    console.log('📤 PLANOSAPI.CREATE - Enviando:', data);
    const duracaoValue = data.duracao !== undefined && data.duracao !== null && data.duracao !== '' ? parseInt(data.duracao) : undefined;
    console.log('🔍 duracao após parse:', { original: data.duracao, parsed: duracaoValue });
    return apiClient.post('/planos', {
      nome: data.nome,
      descricao: data.descricao,
      valor: data.valor,
      duracao: duracaoValue,
      ativo: data.ativo
    });
  },
  update: (id: number, data: any) => {
    console.log('📤 PLANOSAPI.UPDATE - Enviando:', data);
    const duracaoValue = data.duracao !== undefined && data.duracao !== null && data.duracao !== '' ? parseInt(data.duracao) : undefined;
    console.log('🔍 duracao após parse:', { original: data.duracao, parsed: duracaoValue });
    return apiClient.put(`/planos/${id}`, {
      nome: data.nome,
      descricao: data.descricao,
      valor: data.valor,
      duracao: duracaoValue,
      ativo: data.ativo
    });
  },
  delete: (id: number) => apiClient.delete(`/planos/${id}`)
};

export const dashboardApi = {
  getResumo: () => apiClient.get('/dashboard/resumo'),
  getInadimplencia: () => apiClient.get('/dashboard/inadimplencia'),
  getMatriculasTurma: () => apiClient.get('/dashboard/matriculas-turma')
};

export const authApi = {
  login: (email: string, senha: string) =>
    apiClient.post<{ message: string; user: User }>('/auth/login', { email, senha }),
  register: (data: { nome: string; email: string; senha: string }) =>
    apiClient.post<{ message: string; user: User }>('/auth/registrar', data),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get<{ usuario: User }>('/auth/perfil')
};
