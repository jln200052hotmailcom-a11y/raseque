
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Todo, Commitment, Transaction } from '../types';
import { mockTodos, mockCommitments, mockTransactions } from '../services/mockData';
import { ClockIcon, CalendarDaysIcon, WalletIcon } from './icons';

type PersonalTab = 'time' | 'commitments' | 'money';

const PersonalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PersonalTab>('time');

  // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  const TabButton: React.FC<{ tab: PersonalTab; label: string; icon: React.ReactElement; }> = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-semibold rounded-t-lg transition-colors duration-200 border-b-2 ${
        activeTab === tab
          ? 'border-sky-500 text-sky-400'
          : 'border-transparent text-slate-400 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Painel Pessoal</h2>
      <div className="bg-slate-800 rounded-lg shadow-lg">
        <div className="flex border-b border-slate-700">
          <TabButton tab="time" label="Gestão de Tempo" icon={<ClockIcon className="w-5 h-5"/>} />
          <TabButton tab="commitments" label="Compromissos" icon={<CalendarDaysIcon className="w-5 h-5"/>} />
          <TabButton tab="money" label="Finanças" icon={<WalletIcon className="w-5 h-5"/>} />
        </div>
        <div className="p-6">
          {activeTab === 'time' && <TimeManager />}
          {activeTab === 'commitments' && <CommitmentTracker />}
          {activeTab === 'money' && <BudgetTracker />}
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for Personal Dashboard ---

const TimeManager: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Tarefas do Dia</h3>
      <ul className="space-y-3">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center bg-slate-700 p-3 rounded-md">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="h-5 w-5 rounded border-slate-500 text-sky-600 focus:ring-sky-500 bg-slate-800"
            />
            <span className={`ml-3 ${todo.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CommitmentTracker: React.FC = () => {
  const [commitments] = useState<Commitment[]>(mockCommitments);

  const priorityClasses = {
    high: 'border-red-500 bg-red-900/30',
    medium: 'border-yellow-500 bg-yellow-900/30',
    low: 'border-green-500 bg-green-900/30',
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Próximos Compromissos</h3>
       <div className="space-y-3">
        {commitments.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(c => (
          <div key={c.id} className={`flex items-start p-4 rounded-lg border-l-4 ${priorityClasses[c.priority]}`}>
            <div className="flex-shrink-0 text-center mr-4">
                <p className="text-sm text-slate-400">{new Date(c.date).toLocaleDateString('pt-BR', { month: 'short' })}</p>
                <p className="text-2xl font-bold text-white">{new Date(c.date).getDate()}</p>
            </div>
            <div>
                <p className="font-semibold text-white">{c.title}</p>
                <p className="text-sm text-slate-400">{c.time}</p>
            </div>
          </div>
        ))}
       </div>
    </div>
  );
};

const BudgetTracker: React.FC = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const { totalIncome, totalExpenses, balance, expenseByCategory } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const byCategory: { [key: string]: number } = {};

    transactions.forEach(t => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expenses += t.amount;
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      }
    });

    const chartData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));
    return { totalIncome: income, totalExpenses: expenses, balance: income - expenses, expenseByCategory: chartData };
  }, [transactions]);
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Resumo Financeiro</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-sm text-green-400">Receitas</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-sm text-red-400">Despesas</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-sm text-sky-400">Saldo</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(balance)}</p>
          </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Despesas por Categoria</h4>
         <ResponsiveContainer width="100%" height={250}>
            <BarChart data={expenseByCategory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} fontSize={12} />
              <YAxis tick={{ fill: '#94a3b8' }} fontSize={12} tickFormatter={(value) => formatCurrency(value as number)}/>
              <Tooltip
                cursor={{fill: 'rgba(14, 165, 233, 0.1)'}}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  color: '#e2e8f0'
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Bar dataKey="value" fill="#0ea5e9" name="Valor"/>
            </BarChart>
          </ResponsiveContainer>
      </div>

    </div>
  );
};

export default PersonalDashboard;