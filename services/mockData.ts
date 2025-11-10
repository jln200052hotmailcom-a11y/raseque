
import { Investment, Todo, Commitment, Transaction } from '../types';

export const mockInvestments: Investment[] = [
  { id: 'inv-001', companyName: 'QuantumLeap AI', sector: 'Tecnologia', amount: 2500000, date: '2023-05-15', ownershipPercentage: 15.0 },
  { id: 'inv-002', companyName: 'BioSynth Solutions', sector: 'Biotech', amount: 1800000, date: '2023-08-22', ownershipPercentage: 12.5 },
  { id: 'inv-003', companyName: 'EcoPower Renewables', sector: 'Energia Limpa', amount: 3200000, date: '2023-11-01', ownershipPercentage: 20.0 },
  { id: 'inv-004', companyName: 'StellarEats Delivery', sector: 'Logística', amount: 1200000, date: '2024-01-10', ownershipPercentage: 8.0 },
  { id: 'inv-005', companyName: 'CyberGuard Security', sector: 'Tecnologia', amount: 2100000, date: '2024-03-19', ownershipPercentage: 18.0 },
  { id: 'inv-006', companyName: 'NextGen Meds', sector: 'Biotech', amount: 950000, date: '2024-04-05', ownershipPercentage: 7.5 },
];

export const mockTodos: Todo[] = [
  { id: 1, text: 'Preparar apresentação para a reunião de segunda-feira', completed: false },
  { id: 2, text: 'Revisar o relatório trimestral', completed: true },
  { id: 3, text: 'Ligar para o contador', completed: false },
  { id: 4, text: 'Agendar consulta médica', completed: false },
];

export const mockCommitments: Commitment[] = [
  { id: 1, title: 'Reunião com a equipe de marketing', date: '2024-07-29', time: '10:00', priority: 'high', category: 'Reunião' },
  { id: 2, title: 'Almoço com investidor', date: '2024-07-29', time: '12:30', priority: 'high', category: 'Reunião' },
  { id: 3, title: 'Dentista', date: '2024-07-30', time: '15:00', priority: 'medium', category: 'Pessoal' },
  { id: 4, title: 'Jantar de aniversário da Ana', date: '2024-08-02', time: '20:00', priority: 'low', category: 'Pessoal' },
  { id: 5, title: 'Pagar conta de luz', date: '2024-08-10', time: '09:00', priority: 'high', category: 'Conta a Pagar', amount: 150.75 },
];

export const mockTransactions: Transaction[] = [
  { id: 1, type: 'income', description: 'Salário', amount: 7500, category: 'Salário', date: '2024-07-05' },
  { id: 2, type: 'expense', description: 'Aluguel', amount: 1800, category: 'Moradia', date: '2024-07-06' },
  { id: 3, type: 'expense', description: 'Supermercado', amount: 650, category: 'Alimentação', date: '2024-07-10' },
  { id: 4, type: 'expense', description: 'Conta de luz', amount: 150, category: 'Contas', date: '2024-07-15' },
  { id: 5, type: 'expense', description: 'Jantar fora', amount: 120, category: 'Lazer', date: '2024-07-18' },
  { id: 6, type: 'income', description: 'Freelance', amount: 1200, category: 'Extra', date: '2024-07-20' },
  { id: 7, type: 'expense', description: 'Transporte', amount: 200, category: 'Transporte', date: '2024-07-25' },
];