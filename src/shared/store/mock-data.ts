// Mock data pour l'application RH
import { create } from 'zustand';

export type EmployeeStatus = 'active' | 'leave' | 'absent' | 'inactive';
export type ContractType = 'CDI' | 'CDD' | 'Stage' | 'Freelance';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type LeaveType = 'Annual' | 'Sick' | 'Family' | 'Unpaid';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason: string;
}

export interface Pointage {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'absent' | 'late';
  source?: 'app' | 'machine';
}

export type CandidateStatus = 'new' | 'interview' | 'offer' | 'hired' | 'rejected';

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  status: CandidateStatus;
  appliedDate: string;
}

export interface AppSettings {
  companyName: string;
  workHoursStart: string;
  workHoursEnd: string;
  workDays: string[];
}

export type PayrollStatus = 'pending' | 'paid';

export interface Payroll {
  id: string;
  employeeId: string;
  period: string; // e.g. "2026-07"
  
  // Nouveaux champs pour Bulletin de Paie Avancé
  workedDays: number;
  baseSalary: number; // Salaire de Base
  primePresence: number;
  primeTransport: number;
  primeEncouragement: number;
  
  cnssDeduction: number; // Retenue CNSS
  irppDeduction: number; // Retenue IRPP
  cssDeduction: number; // Retenue CSS
  
  netSalary: number; // Net à payer
  congeBalance: number; // Solde Congé
  
  status: PayrollStatus;
  issueDate: string;
}

export type ExpenseStatus = 'pending' | 'approved' | 'rejected';
export type ExpenseCategory = 'Transport' | 'Repas' | 'Hébergement' | 'Matériel' | 'Autre';

export interface Expense {
  id: string;
  employeeId: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  status: ExpenseStatus;
}

export type EvaluationStatus = 'scheduled' | 'in-progress' | 'completed';
export interface Evaluation {
  id: string;
  employeeId: string;
  date: string;
  evaluator: string; // e.g. "Manager"
  score: number; // 0-100
  feedback: string;
  status: EvaluationStatus;
}

export type ObjectiveStatus = 'on-track' | 'at-risk' | 'completed';
export interface Objective {
  id: string;
  employeeId: string;
  title: string;
  progress: number; // 0-100%
  deadline: string;
  status: ObjectiveStatus;
}

export type TrainingStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
export interface Training {
  id: string;
  employeeId: string;
  title: string;
  provider: string;
  date: string; // e.g. 2026-09-01
  durationHours: number;
  status: TrainingStatus;
}

export type DocumentCategory = 'Contrat' | 'Avenant' | 'Certificat' | 'Bulletin de paie' | 'Autre';
export interface HRDocument {
  id: string;
  employeeId: string;
  name: string;
  category: DocumentCategory;
  uploadDate: string;
  url: string; // mock URL
  size: string; // e.g. "2.4 MB"
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: EmployeeStatus;
  contractType: ContractType;
  hireDate: string;
  avatarUrl?: string;
  managerId?: string;
  systemRole: 'ADMIN' | 'EMPLOYEE';
  weeklySchedule?: {
    monday: WorkMode;
    tuesday: WorkMode;
    wednesday: WorkMode;
    thursday: WorkMode;
    friday: WorkMode;
  };
  
  // Champs administratifs pour le bulletin de paie
  cin?: string;
  cnssNumber?: string;
  category?: string;
  echelon?: number;
  baseSalary?: number;
  regime?: string;
}

export type WorkMode = 'remote' | 'onsite';

export interface WorkSchedule {
  id: string;
  employeeId: string;
  date: string;
  mode: WorkMode;
  description: string;
}

interface AuthState {
  user: Employee | null;
  login: (user: Employee) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    firstName: 'Admin',
    lastName: 'RH',
    email: 'admin@gmail.com',
    phone: '+212 6 00 00 00 01',
    department: 'Direction',
    position: 'Directeur Général',
    status: 'active',
    contractType: 'CDI',
    hireDate: '2020-01-15',
    avatarUrl: 'https://i.pravatar.cc/150?u=EMP-001',
    managerId: undefined,
    systemRole: 'ADMIN',
    cin: 'AB123456',
    cnssNumber: '1702437501',
    category: '1',
    echelon: 1,
    baseSalary: 15000,
    regime: 'Mensuel'
  },
  {
    id: 'EMP-002',
    firstName: 'Maha',
    lastName: 'Manager',
    email: 'maha@gmail.com',
    phone: '+212 6 00 00 00 02',
    department: 'Tech',
    position: 'Tech Lead',
    status: 'active',
    contractType: 'CDI',
    hireDate: '2020-03-01',
    avatarUrl: 'https://i.pravatar.cc/150?u=EMP-002',
    managerId: 'EMP-001',
    systemRole: 'EMPLOYEE',
    cin: '09185841',
    cnssNumber: '1702437508',
    category: '1',
    echelon: 1,
    baseSalary: 2164.285,
    regime: 'Mensuel'
  },
  {
    id: 'EMP-003',
    firstName: 'Mansour',
    lastName: 'Employé',
    email: 'mansour@gmail.com',
    phone: '+212 6 00 00 00 03',
    department: 'Tech',
    position: 'Développeur Frontend',
    status: 'active',
    contractType: 'CDI',
    hireDate: '2022-06-15',
    avatarUrl: 'https://i.pravatar.cc/150?u=EMP-003',
    managerId: 'EMP-002',
    systemRole: 'EMPLOYEE'
  },
  {
    id: 'EMP-004',
    firstName: 'Meryem',
    lastName: 'Chraibi',
    email: 'meryem.chraibi@ecopilot.ma',
    phone: '+212 6 00 00 00 04',
    department: 'Commercial',
    position: 'Responsable Commerciale',
    status: 'leave',
    contractType: 'CDI',
    hireDate: '2022-01-10',
    avatarUrl: 'https://i.pravatar.cc/150?u=EMP-004',
    systemRole: 'EMPLOYEE'
  },
  {
    id: 'EMP-005',
    firstName: 'Youssef',
    lastName: 'Fassi',
    email: 'youssef.fassi@ecopilot.ma',
    phone: '+212 6 00 00 00 05',
    department: 'Finance',
    position: 'Comptable',
    status: 'absent',
    contractType: 'CDD',
    hireDate: '2023-09-01',
    avatarUrl: 'https://i.pravatar.cc/150?u=EMP-005',
    managerId: 'EMP-001',
    systemRole: 'EMPLOYEE',
  },
];

const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LR-001',
    employeeId: 'EMP-004',
    type: 'Annual',
    startDate: '2026-07-25',
    endDate: '2026-08-10',
    status: 'approved',
    reason: 'Vacances d\'été',
  },
  {
    id: 'LR-002',
    employeeId: 'EMP-003',
    type: 'Sick',
    startDate: '2026-07-28',
    endDate: '2026-07-29',
    status: 'pending',
    reason: 'Rendez-vous médical',
  }
];

const MOCK_POINTAGES: Pointage[] = [
  {
    id: 'PT-001',
    employeeId: 'EMP-001',
    date: '2026-07-28',
    checkIn: '08:00',
    checkOut: null,
    status: 'present'
  },
  {
    id: 'PT-002',
    employeeId: 'EMP-002',
    date: '2026-07-28',
    checkIn: '08:15',
    checkOut: null,
    status: 'late'
  },
  {
    id: 'PT-003',
    employeeId: 'EMP-003',
    date: '2026-07-28',
    checkIn: '08:45',
    checkOut: '17:45',
    status: 'present',
    source: 'app'
  }
];

const MOCK_WORK_SCHEDULES: WorkSchedule[] = [
  {
    id: 'WS-001',
    employeeId: 'EMP-003', // Mansour
    date: '2026-07-28',
    mode: 'remote',
    description: 'Télétravail'
  },
  {
    id: 'WS-002',
    employeeId: 'EMP-003',
    date: '2026-07-29',
    mode: 'onsite',
    description: 'Réunion d\'équipe'
  }
];

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'CAN-001',
    firstName: 'Yassine',
    lastName: 'Mansouri',
    position: 'Développeur Frontend',
    email: 'yassine.m@example.com',
    status: 'interview',
    appliedDate: '2026-07-20',
  },
  {
    id: 'CAN-002',
    firstName: 'Nadia',
    lastName: 'El Fassi',
    position: 'Chargée RH',
    email: 'nadia.f@example.com',
    status: 'new',
    appliedDate: '2026-07-26',
  },
  {
    id: 'CAN-003',
    firstName: 'Omar',
    lastName: 'Berrada',
    position: 'Product Manager',
    email: 'omar.b@example.com',
    status: 'hired',
    appliedDate: '2026-07-10',
  },
];

const DEFAULT_SETTINGS: AppSettings = {
  companyName: 'Ecopilot',
  workHoursStart: '08:00',
  workHoursEnd: '17:00',
  workDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
};

const MOCK_PAYROLLS: Payroll[] = [
  { 
    id: 'PAY-001', employeeId: 'EMP-001', period: '2026-06', 
    workedDays: 26, baseSalary: 2164.285, primePresence: 6.100, primeTransport: 42.700, primeEncouragement: 208.372,
    cnssDeduction: 234.397, irppDeduction: 376.958, cssDeduction: 10.102,
    netSalary: 1800.000, congeBalance: 8.43,
    status: 'paid', issueDate: '2026-06-25' 
  },
  { 
    id: 'PAY-002', employeeId: 'EMP-002', period: '2026-06', 
    workedDays: 26, baseSalary: 2164.285, primePresence: 6.100, primeTransport: 42.700, primeEncouragement: 208.372,
    cnssDeduction: 234.397, irppDeduction: 376.958, cssDeduction: 10.102,
    netSalary: 1800.000, congeBalance: 8.43,
    status: 'paid', issueDate: '2026-06-25' 
  },
  {
    id: 'PAY-003', employeeId: 'EMP-003', period: '2026-07', 
    workedDays: 26, baseSalary: 2164.285, primePresence: 6.100, primeTransport: 42.700, primeEncouragement: 208.372,
    cnssDeduction: 234.397, irppDeduction: 376.958, cssDeduction: 10.102,
    netSalary: 1800.000, congeBalance: 8.43,
    status: 'pending', issueDate: '2026-07-28' 
  }
];

const MOCK_EXPENSES: Expense[] = [
  {
    id: 'EXP-001',
    employeeId: 'EMP-001',
    date: '2026-07-20',
    amount: 1500,
    category: 'Transport',
    description: 'Billet d\'avion Casa-Tanger',
    status: 'approved'
  },
  {
    id: 'EXP-002',
    employeeId: 'EMP-004',
    date: '2026-07-22',
    amount: 450,
    category: 'Repas',
    description: 'Déjeuner client',
    status: 'pending'
  },
  {
    id: 'EXP-003',
    employeeId: 'EMP-003',
    date: '2026-07-25',
    amount: 3200,
    category: 'Matériel',
    description: 'Achat écran supplémentaire',
    status: 'pending'
  }
];

const MOCK_EVALUATIONS: Evaluation[] = [
  {
    id: 'EV-001',
    employeeId: 'EMP-001',
    date: '2026-06-15',
    evaluator: 'Jane Smith',
    score: 85,
    feedback: 'Excellent trimestre. Dépasse les attentes sur les livrables.',
    status: 'completed'
  },
  {
    id: 'EV-002',
    employeeId: 'EMP-004',
    date: '2026-08-10',
    evaluator: 'John Doe',
    score: 0,
    feedback: '',
    status: 'scheduled'
  }
];

const MOCK_OBJECTIVES: Objective[] = [
  {
    id: 'OBJ-001',
    employeeId: 'EMP-001',
    title: 'Lancement de la v2 de l\'application',
    progress: 75,
    deadline: '2026-09-30',
    status: 'on-track'
  },
  {
    id: 'OBJ-002',
    employeeId: 'EMP-004',
    title: 'Acquisition de 10 nouveaux clients',
    progress: 40,
    deadline: '2026-12-31',
    status: 'at-risk'
  }
];

const MOCK_TRAININGS: Training[] = [
  {
    id: 'TRN-001',
    employeeId: 'EMP-001',
    title: 'React Advanced Patterns',
    provider: 'Udemy',
    date: '2026-08-15',
    durationHours: 12,
    status: 'scheduled'
  },
  {
    id: 'TRN-002',
    employeeId: 'EMP-004',
    title: 'Négociation Commerciale',
    provider: 'Cegos',
    date: '2026-06-10',
    durationHours: 24,
    status: 'completed'
  }
];

const MOCK_DOCUMENTS: HRDocument[] = [
  {
    id: 'DOC-001',
    employeeId: 'EMP-001',
    name: 'Contrat_CDI_Jane_Smith.pdf',
    category: 'Contrat',
    uploadDate: '2022-03-01',
    url: '#',
    size: '1.2 MB'
  },
  {
    id: 'DOC-002',
    employeeId: 'EMP-004',
    name: 'Attestation_Formation_Securite.pdf',
    category: 'Certificat',
    uploadDate: '2026-02-15',
    url: '#',
    size: '800 KB'
  }
];

const MOCK_HOLIDAYS: Holiday[] = [
  { id: 'HOL-001', name: 'Nouvel An', date: '2026-01-01' },
  { id: 'HOL-002', name: 'Fête du Travail', date: '2026-05-01' },
  { id: 'HOL-003', name: 'Fête Nationale', date: '2026-07-14' },
  { id: 'HOL-004', name: 'Assomption', date: '2026-08-15' },
  { id: 'HOL-005', name: 'Toussaint', date: '2026-11-01' },
  { id: 'HOL-006', name: 'Noël', date: '2026-12-25' }
];

interface EmployeeStore {
  currentUser: Employee | null;
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  pointages: Pointage[];
  candidates: Candidate[];
  settings: AppSettings;
  payrolls: Payroll[];
  expenses: Expense[];
  evaluations: Evaluation[];
  objectives: Objective[];
  trainings: Training[];
  documents: HRDocument[];
  holidays: Holiday[];
  workSchedules: WorkSchedule[];
  getEmployeeById: (id: string) => Employee | undefined;
  getLeaveRequestsByEmployee: (id: string) => LeaveRequest[];
  getPointagesByEmployee: (id: string) => Pointage[];
  getPayrollsByEmployee: (id: string) => Payroll[];
  getExpensesByEmployee: (id: string) => Expense[];
  getEvaluationsByEmployee: (id: string) => Evaluation[];
  getObjectivesByEmployee: (id: string) => Objective[];
  getTrainingsByEmployee: (id: string) => Training[];
  getDocumentsByEmployee: (id: string) => HRDocument[];
  getWorkSchedulesByEmployee: (id: string) => WorkSchedule[];
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employeeData: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addLeaveRequest: (request: Omit<LeaveRequest, 'id'>) => void;
  updateLeaveRequestStatus: (id: string, status: LeaveStatus) => void;
  addCandidate: (candidate: Omit<Candidate, 'id'>) => void;
  updateCandidateStatus: (id: string, status: CandidateStatus) => void;
  addPointage: (pointage: Omit<Pointage, 'id'>) => void;
  updatePointage: (id: string, checkOut: string) => void;
  generatePayroll: (payroll: Omit<Payroll, 'id'>) => void;
  updatePayrollStatus: (id: string, status: PayrollStatus) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpenseStatus: (id: string, status: ExpenseStatus) => void;
  addEvaluation: (evaluation: Omit<Evaluation, 'id'>) => void;
  addObjective: (objective: Omit<Objective, 'id'>) => void;
  updateObjectiveProgress: (id: string, progress: number, status: ObjectiveStatus) => void;
  addTraining: (training: Omit<Training, 'id'>) => void;
  updateTrainingStatus: (id: string, status: TrainingStatus) => void;
  addDocument: (document: Omit<HRDocument, 'id'>) => void;
  deleteDocument: (id: string) => void;
  addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  deleteHoliday: (id: string) => void;
  addWorkSchedule: (schedule: Omit<WorkSchedule, 'id'>) => void;
  updateWorkSchedule: (id: string, schedule: Partial<WorkSchedule>) => void;
  deleteWorkSchedule: (id: string) => void;
  login: (email: string) => boolean;
  logout: () => void;
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  currentUser: null,
  employees: MOCK_EMPLOYEES,
  leaveRequests: MOCK_LEAVE_REQUESTS,
  pointages: MOCK_POINTAGES,
  candidates: MOCK_CANDIDATES,
  settings: DEFAULT_SETTINGS,
  payrolls: MOCK_PAYROLLS,
  expenses: MOCK_EXPENSES,
  evaluations: MOCK_EVALUATIONS,
  objectives: MOCK_OBJECTIVES,
  trainings: MOCK_TRAININGS,
  documents: MOCK_DOCUMENTS,
  holidays: MOCK_HOLIDAYS,
  workSchedules: MOCK_WORK_SCHEDULES,
  getEmployeeById: (id) => get().employees.find((e) => e.id === id),
  getLeaveRequestsByEmployee: (id) => get().leaveRequests.filter((lr) => lr.employeeId === id),
  getPointagesByEmployee: (id) => get().pointages.filter((p) => p.employeeId === id),
  getPayrollsByEmployee: (id) => get().payrolls.filter((p) => p.employeeId === id),
  getExpensesByEmployee: (id) => get().expenses.filter((e) => e.employeeId === id),
  getEvaluationsByEmployee: (id) => get().evaluations.filter((e) => e.employeeId === id),
  getObjectivesByEmployee: (id) => get().objectives.filter((o) => o.employeeId === id),
  getTrainingsByEmployee: (id) => get().trainings.filter((t) => t.employeeId === id),
  getDocumentsByEmployee: (id) => get().documents.filter((d) => d.employeeId === id),
  getWorkSchedulesByEmployee: (id) => get().workSchedules.filter((ws) => ws.employeeId === id),
  updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  addEmployee: (emp) => set((state) => ({ 
    employees: [...state.employees, { ...emp, id: `EMP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` }] 
  })),
  updateEmployee: (id, data) =>
    set((state) => ({
      employees: state.employees.map((e) => e.id === id ? { ...e, ...data } : e)
    })),
  deleteEmployee: (id) => set((state) => ({
    employees: state.employees.filter(e => e.id !== id)
  })),
  addLeaveRequest: (req) => set((state) => ({
    leaveRequests: [...state.leaveRequests, { ...req, id: `LR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` }]
  })),
  updateLeaveRequestStatus: (id, status) => set((state) => ({
    leaveRequests: state.leaveRequests.map(lr => lr.id === id ? { ...lr, status } : lr)
  })),
  addCandidate: (cand) => set((state) => ({
    candidates: [...state.candidates, { ...cand, id: `CAN-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` }]
  })),
  updateCandidateStatus: (id, status) => set((state) => ({
    candidates: state.candidates.map(c => c.id === id ? { ...c, status } : c)
  })),
  addPointage: (pointage) => set((state) => ({
    pointages: [...state.pointages, { ...pointage, id: `PT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` }]
  })),
  updatePointage: (id, checkOut) => set((state) => ({
    pointages: state.pointages.map(p => p.id === id ? { ...p, checkOut } : p)
  })),
  generatePayroll: (payroll) => set((state) => ({
    payrolls: [...state.payrolls, { ...payroll, id: `PAY-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` }]
  })),
  updatePayrollStatus: (id, status) => set((state) => ({
    payrolls: state.payrolls.map(p => p.id === id ? { ...p, status } : p)
  })),
  addExpense: (expense) => set((state) => ({
    expenses: [...state.expenses, { ...expense, id: `EXP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` }]
  })),
  updateExpenseStatus: (id, status) => set((state) => ({
    expenses: state.expenses.map(e => e.id === id ? { ...e, status } : e)
  })),
  addEvaluation: (evalu) => set((state) => ({
    evaluations: [...state.evaluations, { ...evalu, id: `EV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` }]
  })),
  addObjective: (obj) => set((state) => ({
    objectives: [...state.objectives, { ...obj, id: `OBJ-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` }]
  })),
  updateObjectiveProgress: (id, progress, status) => set((state) => ({
    objectives: state.objectives.map(o => o.id === id ? { ...o, progress, status } : o)
  })),
  addTraining: (training) => set((state) => ({
    trainings: [...state.trainings, { ...training, id: `TRN-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` }]
  })),
  updateTrainingStatus: (id, status) => set((state) => ({
    trainings: state.trainings.map(t => t.id === id ? { ...t, status } : t)
  })),
  addDocument: (document) => set((state) => ({
    documents: [{ ...document, id: `DOC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` }, ...state.documents]
  })),
  deleteDocument: (id) => set((state) => ({
    documents: state.documents.filter(d => d.id !== id)
  })),
  addHoliday: (h) => set((state) => ({ holidays: [...state.holidays, { ...h, id: `HOL-${Date.now()}` }] })),
  deleteHoliday: (id) => set((state) => ({ holidays: state.holidays.filter(h => h.id !== id) })),
  addWorkSchedule: (ws) => set((state) => ({ workSchedules: [...state.workSchedules, { ...ws, id: `WS-${Date.now()}` }] })),
  updateWorkSchedule: (id, data) => set((state) => ({
    workSchedules: state.workSchedules.map(ws => ws.id === id ? { ...ws, ...data } : ws)
  })),
  deleteWorkSchedule: (id) => set((state) => ({
    workSchedules: state.workSchedules.filter(ws => ws.id !== id)
  })),
  login: (email) => {
    const user = get().employees.find(e => e.email === email);
    if (user) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },
  logout: () => set({ currentUser: null })
}));
