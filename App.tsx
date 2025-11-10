import React, { useState } from 'react';
import CorporateDashboard from './components/CorporateDashboard';
import PersonalDashboard from './components/PersonalDashboard';
import Auth from './components/Auth';
import { BriefcaseIcon, UserIcon, ChartPieIcon, LogoutIcon } from './components/icons';

type View = 'corporate' | 'personal';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('corporate');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  const NavButton = ({ view, label, icon }: { view: View; label: string; icon: React.ReactElement }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
        activeView === view
          ? 'bg-sky-600 text-white'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg shadow-slate-900/50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <ChartPieIcon className="w-8 h-8 text-sky-500" />
              <h1 className="text-xl font-bold text-white tracking-tight">
                Raseque Investimentos
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg">
                <NavButton view="corporate" label="Corporativo" icon={<BriefcaseIcon className="w-5 h-5" />} />
                <NavButton view="personal" label="Pessoal" icon={<UserIcon className="w-5 h-5" />} />
              </div>
               <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 text-slate-400 hover:bg-slate-700 hover:text-white"
                aria-label="Sair"
              >
                <LogoutIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {activeView === 'corporate' ? <CorporateDashboard /> : <PersonalDashboard />}
      </main>
    </div>
  );
};

export default App;