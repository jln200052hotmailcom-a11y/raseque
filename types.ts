
export interface Investment {
  id: string;
  companyName: string;
  sector: string;
  amount: number;
  date: string;
  ownershipPercentage: number;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface Commitment {
  id: number;
  title: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  category: 'Reunião' | 'Pessoal' | 'Conta a Pagar' | 'Outro';
  amount?: number;
}

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
}