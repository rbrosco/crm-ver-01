import React, { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, AlertTriangle, LogOut, Timer, Calendar, Ban } from 'lucide-react';
import { Client } from './types';
import { StatCard } from './components/StatCard';
import { ClientForm } from './components/ClientForm';
import { ClientList } from './components/ClientList';
import { Login } from './components/Login';

type FilterType = 'all' | '10' | '30' | 'pending';

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('crm_auth') === 'true';
  });

  // Initialize clients from localStorage if available
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem('crm_clients');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load from local storage", e);
      return [];
    }
  });
  
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Filter State
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Save to localStorage whenever clients change
  useEffect(() => {
    localStorage.setItem('crm_clients', JSON.stringify(clients));
  }, [clients]);

  const handleLogin = (status: boolean) => {
    setIsAuthenticated(status);
    if (status) {
      localStorage.setItem('crm_auth', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('crm_auth');
  };

  const addClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
  };

  const updateClient = (updatedClient: Client) => {
    setClients((prev) => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    setClientToEdit(null); // Clear edit mode
  };

  // Handle importing clients from CSV
  const handleImportClients = (importedClients: Client[]) => {
    setClients((prev) => [...importedClients, ...prev]);
    alert(`${importedClients.length} clientes importados com sucesso!`);
  };

  const requestDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setClients((prev) => prev.filter(c => c.id !== deleteId));
      
      // If the deleted client was being edited, clear the form
      if (clientToEdit?.id === deleteId) {
        setClientToEdit(null);
      }
      setDeleteId(null);
    }
  };

  const startEditing = (client: Client) => {
    setClientToEdit(client);
  };

  const cancelEditing = () => {
    setClientToEdit(null);
  };

  const toggleFilter = (filter: FilterType) => {
    setActiveFilter(prev => prev === filter ? 'all' : filter);
  };

  // --- REPORTING LOGIC ---
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to midnight

    let expiringIn10 = 0;
    let expiringIn30 = 0;
    let totalPending = 0;

    clients.forEach(client => {
      // 1. Calculate Pending (Not Paid)
      if (!client.isPaid) {
        totalPending++;
      }

      // 2. Calculate Expiration Date
      if (client.entryDate) {
        const parts = client.entryDate.split('-');
        if (parts.length === 3) {
          const entry = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          
          // Add subscription days to entry date
          const expiryDate = new Date(entry);
          expiryDate.setDate(entry.getDate() + (Number(client.subscriptionDays) || 0));

          // Calculate difference in milliseconds
          const diffTime = expiryDate.getTime() - today.getTime();
          // Convert to days
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // Logic: We count as "expiring" if it expires today or in the future within the range.
          if (diffDays >= 0 && diffDays <= 10) {
            expiringIn10++;
          }
          if (diffDays >= 0 && diffDays <= 30) {
            expiringIn30++;
          }
        }
      }
    });

    return { expiringIn10, expiringIn30, totalPending };
  }, [clients]);

  // Render Login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    // MAIN LAYOUT FIX: Scaling Adjustments
    // Changed max-w from 1800px to 1920px
    // Added xl:min-w-[1440px] to force desktop expansion
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 font-sans flex flex-col relative overflow-x-auto">
      
      {/* Header */}
      <header className="shrink-0 z-40 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 shadow-xl shadow-black/30 sticky top-0">
        <div className="max-w-[1920px] xl:min-w-[1440px] mx-auto px-4 sm:px-10 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary-600/20 p-2.5 rounded-xl text-primary-500 border border-primary-500/20">
              <LayoutGrid size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
                CRM<span className="text-primary-500">Pro</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 bg-zinc-800/50 rounded-full border border-zinc-700/50">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
              <span className="text-sm font-semibold text-zinc-400">Sistema Online</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-zinc-700"
              title="Sair"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Content Wrapper - Applied Width Constraints */}
      <main className="flex-1 flex flex-col min-h-0 max-w-[1920px] xl:min-w-[1440px] w-full mx-auto px-4 sm:px-10 lg:px-12 mt-6 sm:mt-8 animate-fadeIn mb-8">
        
        {/* Stats Row - Clickable for Filtering */}
        <div className="shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Vencimento (10 Dias)" 
            value={stats.expiringIn10} 
            icon={<Timer size={36} className="text-rose-500" />} 
            iconColor="bg-rose-500/10 text-rose-500 border-rose-500/20"
            onClick={() => toggleFilter('10')}
            isActive={activeFilter === '10'}
          />
          <StatCard 
            title="Vencimento (30 Dias)" 
            value={stats.expiringIn30} 
            icon={<Calendar size={36} className="text-amber-500" />} 
            iconColor="bg-amber-500/10 text-amber-500 border-amber-500/20"
            onClick={() => toggleFilter('30')}
            isActive={activeFilter === '30'}
          />
          <StatCard 
            title="Pendentes / Não Pagos" 
            value={stats.totalPending} 
            icon={<Ban size={36} className="text-red-500" />} 
            iconColor="bg-red-500/10 text-red-500 border-red-500/20"
            onClick={() => toggleFilter('pending')}
            isActive={activeFilter === 'pending'}
          />
        </div>

        {/* Main Columns (Form + List) */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 pb-6">
          
          {/* Left Panel - Form 
              UPDATED: xl:col-span-3 (was 4) to make it narrower (approx 350px on standard desktop) */}
          <div className="xl:col-span-3 h-full min-w-[320px]">
            <ClientForm 
              onAddClient={addClient} 
              onUpdateClient={updateClient}
              clientToEdit={clientToEdit}
              onCancelEdit={cancelEditing}
            />
          </div>

          {/* Right Panel - List 
              UPDATED: xl:col-span-9 (was 8) to give more room to table */}
          <div className="xl:col-span-9 h-full rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/20 overflow-hidden">
            <ClientList 
              clients={clients} 
              onDelete={requestDelete} 
              onEdit={startEditing}
              onImport={handleImportClients}
              activeFilter={activeFilter}
              onClearFilter={() => setActiveFilter('all')}
            />
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 rounded-2xl shadow-2xl shadow-black/60 border border-zinc-800 p-8 max-w-md w-full animate-fadeIn scale-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="text-red-500 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-100 mb-3">Confirmar Exclusão</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Tem certeza que deseja remover este registro? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteId(null)}
                className="flex-1 px-6 py-4 bg-zinc-800 border border-zinc-700 text-zinc-300 text-lg rounded-xl hover:bg-zinc-700 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-6 py-4 bg-red-600/90 text-white text-lg rounded-xl hover:bg-red-600 font-medium transition-colors shadow-lg shadow-red-900/30"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;