import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Todo, Commitment, Transaction } from '../types';
import { mockTodos, mockCommitments, mockTransactions } from '../services/mockData';
// FIX: Imported `BriefcaseIcon` to resolve the "Cannot find name 'BriefcaseIcon'" error.
import { ClockIcon, CalendarDaysIcon, WalletIcon, PlusIcon, CurrencyDollarIcon, UsersIcon, TagIcon, BriefcaseIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from './icons';

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
  const [newTodoText, setNewTodoText] = useState('');

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };
  
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim() === '') return;
    const newTodo: Todo = {
      id: Date.now(),
      text: newTodoText,
      completed: false,
    };
    setTodos(prev => [...prev, newTodo]);
    setNewTodoText('');
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
       <form onSubmit={handleAddTodo} className="flex gap-2 pt-4">
        <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Adicionar nova tarefa..."
            className="flex-grow px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button type="submit" className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 bg-sky-600 hover:bg-sky-700 text-white">
            <PlusIcon className="w-5 h-5" />
            <span>Adicionar</span>
        </button>
      </form>
    </div>
  );
};

const CommitmentTracker: React.FC = () => {
  const [commitments, setCommitments] = useState<Commitment[]>(mockCommitments);
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<"low" | "medium" | "high">('medium');
  const [category, setCategory] = useState<Commitment['category']>('Pessoal');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) {
        alert("Por favor, preencha o título, data e hora.");
        return;
    };

    const newCommitment: Commitment = {
      id: Date.now(),
      title,
      date,
      time,
      priority,
      category,
      amount: category === 'Conta a Pagar' && amount ? parseFloat(amount) : undefined,
    };

    setCommitments(prev => [...prev, newCommitment].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));

    setTitle('');
    setDate('');
    setTime('');
    setPriority('medium');
    setCategory('Pessoal');
    setAmount('');
    setIsFormVisible(false);
  };

  const priorityClasses = {
    high: 'border-red-500 bg-red-900/30',
    medium: 'border-yellow-500 bg-yellow-900/30',
    low: 'border-green-500 bg-green-900/30',
  };

  const categoryIcons: Record<Commitment['category'], React.ReactElement> = {
    'Reunião': <UsersIcon className="w-6 h-6 text-indigo-400" />,
    'Pessoal': <TagIcon className="w-6 h-6 text-teal-400" />,
    'Conta a Pagar': <CurrencyDollarIcon className="w-6 h-6 text-amber-400" />,
    'Outro': <BriefcaseIcon className="w-6 h-6 text-slate-400" />,
  };
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Próximos Compromissos</h3>
        <button 
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 bg-sky-600 hover:bg-sky-700 text-white"
        >
            <PlusIcon className="w-5 h-5" />
            {isFormVisible ? 'Cancelar' : 'Adicionar Compromisso'}
        </button>
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="bg-slate-700/50 p-4 rounded-lg space-y-4">
            <input
                type="text"
                placeholder="Título do compromisso"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="low">Prioridade Baixa</option>
                    <option value="medium">Prioridade Média</option>
                    <option value="high">Prioridade Alta</option>
                </select>
                <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="Pessoal">Pessoal</option>
                    <option value="Reunião">Reunião</option>
                    <option value="Conta a Pagar">Conta a Pagar</option>
                    <option value="Outro">Outro</option>
                </select>
            </div>
             {category === 'Conta a Pagar' && (
                <input
                    type="number"
                    placeholder="Valor (ex: 150.50)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    step="0.01"
                />
            )}
            <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none">
                Salvar Compromisso
            </button>
        </form>
      )}

       <div className="space-y-3">
        {commitments.map(c => (
          <div key={c.id} className={`flex items-center gap-4 p-4 rounded-lg border-l-4 ${priorityClasses[c.priority]}`}>
            <div className="flex-shrink-0 bg-slate-700/50 p-2 rounded-full">
                {categoryIcons[c.category]}
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-white">{c.title}</p>
                <p className="text-sm text-slate-400">{c.time}</p>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium text-white">{new Date(c.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                {c.category === 'Conta a Pagar' && c.amount != null && (
                    <p className="text-xs font-bold text-amber-400">{formatCurrency(c.amount)}</p>
                )}
            </div>
          </div>
        ))}
       </div>
    </div>
  );
};


const BudgetTracker: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

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

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    const newTransaction: Transaction = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        type,
        category,
        date,
    };
    setTransactions(prev => [newTransaction, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsFormVisible(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Resumo Financeiro</h3>
          <button 
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 bg-sky-600 hover:bg-sky-700 text-white"
          >
              <PlusIcon className="w-5 h-5" />
              {isFormVisible ? 'Cancelar' : 'Nova Transação'}
          </button>
      </div>
      
      {isFormVisible && (
        <form onSubmit={handleTransactionSubmit} className="bg-slate-700/50 p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Descrição"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                 <input
                    type="number"
                    placeholder="Valor"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    step="0.01"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-slate-900 border border-slate-700 rounded-md flex p-1">
                  <button type="button" onClick={() => setType('income')} className={`flex-1 text-sm py-1 rounded ${type === 'income' ? 'bg-green-600 text-white' : 'text-slate-300'}`}>Receita</button>
                  <button type="button" onClick={() => setType('expense')} className={`flex-1 text-sm py-1 rounded ${type === 'expense' ? 'bg-red-600 text-white' : 'text-slate-300'}`}>Despesa</button>
               </div>
                <input
                    type="text"
                    placeholder="Categoria"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                />
            </div>
            <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none">
                Salvar Transação
            </button>
        </form>
      )}

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

      <div className="mt-6">
        <h4 className="text-lg font-semibold text-white mb-4">Últimas Transações</h4>
        <ul className="space-y-3">
            {transactions.map(t => (
                <li key={t.id} className="flex items-center justify-between bg-slate-700 p-3 rounded-md hover:bg-slate-600/50 transition-colors">
                    <div className="flex items-center gap-4">
                        {t.type === 'income' ? 
                            <ArrowUpCircleIcon className="w-8 h-8 flex-shrink-0 text-green-500"/> :
                            <ArrowDownCircleIcon className="w-8 h-8 flex-shrink-0 text-red-500"/>
                        }
                        <div>
                            <p className="font-medium text-white">{t.description}</p>
                            <p className="text-sm text-slate-400">{t.category} &bull; {new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                        </div>
                    </div>
                    <p className={`font-semibold text-lg ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                        {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </p>
                </li>
            ))}
        </ul>
      </div>

    </div>
  );
};

export default PersonalDashboard;