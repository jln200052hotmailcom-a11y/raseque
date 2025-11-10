
import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Investment } from '../types';
import { mockInvestments } from '../services/mockData';

const StatCard: React.FC<{ title: string; value: string; subtext?: string }> = ({ title, value, subtext }) => (
  <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
    <h3 className="text-sm font-medium text-slate-400">{title}</h3>
    <p className="text-3xl font-bold text-white mt-1">{value}</p>
    {subtext && <p className="text-xs text-slate-500 mt-2">{subtext}</p>}
  </div>
);

const COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#f97316', '#ec4899', '#8b5cf6'];

const CorporateDashboard: React.FC = () => {
  const investments: Investment[] = mockInvestments;

  const totalInvested = useMemo(() => 
    investments.reduce((sum, inv) => sum + inv.amount, 0),
    [investments]
  );

  const sectorData = useMemo(() => {
    const sectors: { [key: string]: number } = {};
    investments.forEach(inv => {
      if (sectors[inv.sector]) {
        sectors[inv.sector] += inv.amount;
      } else {
        sectors[inv.sector] = inv.amount;
      }
    });
    return Object.entries(sectors).map(([name, value]) => ({ name, value }));
  }, [investments]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Painel Corporativo</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Investido" 
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested)}
          subtext="Capital alocado em todas as empresas"
        />
        <StatCard 
          title="Empresas no Portfólio" 
          value={investments.length.toString()}
          subtext="Número de investimentos ativos"
        />
        <StatCard 
          title="Retorno Estimado (Anual)" 
          value="+18.5%"
          subtext="Projeção baseada em performance"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Investment Table */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Relatório de Investimentos</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-700 text-slate-400 text-sm">
                <tr>
                  <th className="p-3">Empresa</th>
                  <th className="p-3">Setor</th>
                  <th className="p-3 text-right">Valor</th>
                  <th className="p-3 text-right">Participação</th>
                  <th className="p-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv, index) => (
                  <tr key={inv.id} className={`border-b border-slate-700 ${index === investments.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="p-3 font-medium text-white">{inv.companyName}</td>
                    <td className="p-3 text-slate-300">
                      <span className="px-2 py-1 text-xs rounded-full bg-sky-900/50 text-sky-300">{inv.sector}</span>
                    </td>
                    <td className="p-3 text-right text-slate-300">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inv.amount)}</td>
                    <td className="p-3 text-right text-slate-300">{inv.ownershipPercentage.toFixed(1)}%</td>
                    <td className="p-3 text-slate-300">{new Date(inv.date).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector Distribution Chart */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-4">Distribuição por Setor</h3>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: '#e2e8f0'
                  }}
                  formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateDashboard;
