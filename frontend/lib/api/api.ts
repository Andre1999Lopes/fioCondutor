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
  getAll: () => apiClient.get<Turma[]>('/turmas'),
  getById: (id: number) => apiClient.get<Turma>(`/turmas/${id}`),
  create: (data: any) => apiClient.post<Turma>('/turmas', data),
  update: (id: number, data: any) => apiClient.put<Turma>(`/turmas/${id}`, data),
  delete: (id: number) => apiClient.delete(`/turmas/${id}`)
};

export const matriculasApi = {
  getAll: () => apiClient.get<Matricula[]>('/matriculas'),
  create: (data: any) => apiClient.post<Matricula>('/matriculas', data),
  delete: (id: number) => apiClient.delete(`/matriculas/${id}`),
  getByTurma: (turmaId: number) => apiClient.get(`/matriculas/turma/${turmaId}`)
};

export const pagamentosApi = {
  getAll: () => apiClient.get<Pagamento[]>('/pagamentos'),
  create: (data: any) => apiClient.post<Pagamento>('/pagamentos', data),
  updateStatus: (id: number, status: string) => apiClient.put(`/pagamentos/${id}/status`, { status }),
  getByAluno: (alunoId: number) => apiClient.get(`/pagamentos/aluno/${alunoId}`),
  getAtrasados: () => apiClient.get('/pagamentos/atrasados'),
  delete: (id: number) => apiClient.delete(`/pagamentos/${id}`)
};

export const planosApi = {
  getAll: () => apiClient.get('/planos'),
  getById: (id: number) => apiClient.get(`/planos/${id}`),
  create: (data: any) => apiClient.post('/planos', data),
  update: (id: number, data: any) => apiClient.put(`/planos/${id}`, data),
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
