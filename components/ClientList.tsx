import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Search, Upload, Download, Trash2, Edit, ChevronUp, ChevronDown, Filter, Phone, Calendar, Globe, Wifi, X } from 'lucide-react';
import { Client } from '../types';

interface ClientListProps {
  clients: Client[];
  onDelete: (id: string) => void;
  onEdit: (client: Client) => void;
  onImport: (clients: Client[]) => void;
  activeFilter?: 'all' | '10' | '30' | 'pending';
  onClearFilter?: () => void;
}

type SortDirection = 'asc' | 'desc';
interface SortConfig {
  key: keyof Client;
  direction: SortDirection;
}

// LARGURAS OTIMIZADAS (DENSIDADE ALTA)
const DEFAULT_WIDTHS: { [key: string]: number } = {
  fullName: 0, 
  phone: 140,
  country: 110,
  macAddress: 140,
  entryDate: 110,
  subscriptionDays: 90,
  isPaid: 80,
  actions: 80
};

export const ClientList: React.FC<ClientListProps> = ({ 
  clients, 
  onDelete, 
  onEdit, 
  onImport,
  activeFilter = 'all',
  onClearFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<Partial<Record<keyof Client, string>>>({});
  
  // Resizing State
  const [columnWidths, setColumnWidths] = useState(DEFAULT_WIDTHS);
  const resizingRef = useRef<{ startX: number; startWidth: number; columnKey: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSort = (key: keyof Client) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key: keyof Client, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // --- RESIZING LOGIC ---

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizingRef.current) return;
    const { startX, startWidth, columnKey } = resizingRef.current;
    const delta = e.clientX - startX;
    
    setColumnWidths(prev => ({
      ...prev,
      [columnKey]: Math.max(50, startWidth + delta) // Minimum width 50px
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    if (resizingRef.current) {
      resizingRef.current = null;
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [handleMouseMove]);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseUp, handleMouseMove]);

  const startResizing = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = {
      startX: e.clientX,
      startWidth: columnWidths[key],
      columnKey: key
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.body.style.cursor = 'col-resize';
  };


  // Helper Normalization
  const normalizeText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Helper to strip non-digits for phone search
  const onlyDigits = (text: string) => text.replace(/\D/g, '');

  const processedClients = useMemo(() => {
    let result = [...clients];

    // 0. Active Quick Filter (from Stat Cards)
    if (activeFilter && activeFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      result = result.filter(client => {
        if (activeFilter === 'pending') {
          return !client.isPaid;
        }

        // Date Calculation for 10/30 days
        if (client.entryDate) {
          const parts = client.entryDate.split('-');
          if (parts.length === 3) {
            const entry = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            const expiryDate = new Date(entry);
            expiryDate.setDate(entry.getDate() + (Number(client.subscriptionDays) || 0));

            const diffTime = expiryDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (activeFilter === '10') {
              return diffDays >= 0 && diffDays <= 10;
            }
            if (activeFilter === '30') {
              return diffDays >= 0 && diffDays <= 30;
            }
          }
        }
        return false;
      });
    }

    // 1. Column Filters
    Object.keys(filters).forEach((key) => {
      const filterValue = filters[key as keyof Client]?.toLowerCase();
      if (!filterValue || filterValue === 'todos') return;

      result = result.filter((client) => {
        const clientValue = client[key as keyof Client];

        if (key === 'isPaid') {
          // Determinar status baseado em isPaid e subscriptionDays
          let statusString = 'pendente';
          if (client.subscriptionDays <= 0) {
            statusString = 'nao-ativo';
          } else if (clientValue) {
            statusString = 'ativo';
          }
          return statusString === filterValue;
        }

        return String(clientValue).toLowerCase().includes(filterValue);
      });
    });

    // 2. Global Search
    if (searchTerm) {
      const termNormalized = normalizeText(searchTerm);
      const termDigits = onlyDigits(searchTerm);

      result = result.filter(c => {
        const nameMatch = normalizeText(c.fullName).includes(termNormalized);
        const countryMatch = normalizeText(c.country).includes(termNormalized);
        const macMatch = c.macAddress.toLowerCase().includes(termNormalized);

        let phoneMatch = false;
        if (termDigits.length > 0) {
           const clientPhoneDigits = onlyDigits(c.phone);
           phoneMatch = clientPhoneDigits.includes(termDigits);
        }

        return nameMatch || countryMatch || macMatch || phoneMatch;
      });
    }

    // 3. Sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [clients, filters, searchTerm, sortConfig, activeFilter]);

  const handleExport = () => {
    if (processedClients.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }
    const headers = ["ID", "Nome Completo", "Telefone", "País", "MAC Address", "Data Início", "Duração", "Status Pago"];
    const rows = processedClients.map(client => [
      `"${client.id}"`,
      `"${client.fullName}"`,
      `"${client.phone}"`,
      `"${client.country}"`,
      `"${client.macAddress}"`,
      `"${client.entryDate}"`,
      client.subscriptionDays,
      client.isPaid ? "Sim" : "Não"
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `clientes_crm_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => processCSV(event.target?.result as string);
    reader.readAsText(file);
  };

  const processCSV = (csvText: string) => {
    try {
      const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
      if (lines.length < 2) return alert("Arquivo CSV inválido.");
      // Simplified simulation logic reused
      alert("Importação simulada. A lógica CSV pode ser expandida aqui.");
    } catch (error) {
      console.error(error);
      alert("Erro ao processar.");
    }
  };

  const renderHeader = (label: string, fieldKey: string, isSelect: boolean = false, hideOnMobile: boolean = false) => {
    const style = fieldKey === 'fullName' ? {} : { width: columnWidths[fieldKey] };
    // Responsive Visibility Class
    const visibilityClass = hideOnMobile ? 'hidden md:table-cell' : '';

    return (
      <th 
        key={fieldKey}
        className={`px-1.5 py-0.5 text-left align-top bg-zinc-900 border-b border-zinc-800 relative select-none whitespace-nowrap ${visibilityClass}`}
        style={style}
      >
        <div className="flex flex-col gap-1.5">
          <div 
            className="flex items-center gap-0.5 cursor-pointer group"
            onClick={() => handleSort(fieldKey as keyof Client)}
          >
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider group-hover:text-primary-400 transition-colors whitespace-nowrap">
              {label}
            </span>
            <div className="text-zinc-600 group-hover:text-primary-500">
              {sortConfig?.key === fieldKey ? (
                sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
              ) : (
                <Filter size={10} className="opacity-0 group-hover:opacity-50" />
              )}
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()}> 
            {isSelect ? (
              <select
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs rounded px-1 py-0.5 focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
                value={filters[fieldKey as keyof Client] || 'todos'}
                onChange={(e) => handleFilterChange(fieldKey as keyof Client, e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="ativo">Ativo</option>
                <option value="pendente">Pendente</option>
                <option value="nao-ativo">Não Ativo</option>
              </select>
            ) : (
              <input
                type="text"
                autoComplete="off"
                placeholder="Filtrar..."
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs rounded px-1 py-0.5 focus:outline-none focus:border-primary-500 placeholder-zinc-600"
                value={filters[fieldKey as keyof Client] || ''}
                onChange={(e) => handleFilterChange(fieldKey as keyof Client, e.target.value)}
              />
            )}
          </div>
        </div>
        
        <div 
          className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-primary-500 active:bg-primary-500 transition-colors z-20"
          onMouseDown={(e) => startResizing(e, fieldKey)}
        />
      </th>
    );
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />

      {/* Header Bar */}
      <div className="p-4 md:p-6 border-b border-zinc-800 flex flex-col xl:flex-row justify-between items-center gap-6 bg-zinc-900 shrink-0">
        <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-start">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Clientes</h2>
            <span className="bg-zinc-800 text-zinc-400 text-base font-bold px-4 py-1 rounded-full border border-zinc-700">{processedClients.length}</span>
            
            {activeFilter && activeFilter !== 'all' && (
              <div className="flex items-center gap-2 bg-primary-600/20 border border-primary-500/30 text-primary-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-fadeIn">
                 <span>Filtro: {activeFilter === 'pending' ? 'Pendentes' : `${activeFilter} Dias`}</span>
                 <button onClick={onClearFilter} className="hover:text-white transition-colors">
                   <X size={14} />
                 </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full sm:flex-1 xl:flex-initial group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 group-focus-within:text-primary-500 transition-colors" size={20} />
            <input 
              type="search" 
              autoComplete="off"
              placeholder="Pesquisar..." 
              className="w-full xl:w-80 bg-zinc-950 border border-zinc-700 text-zinc-100 text-base rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-zinc-600 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={handleImportClick} className="flex-1 sm:flex-none p-3 text-zinc-400 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:text-white rounded-xl transition-colors">
              <Upload size={20} />
            </button>
            <button onClick={handleExport} className="flex-1 sm:flex-none p-3 text-zinc-400 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:text-white rounded-xl transition-colors">
              <Download size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area - RESPONSIVE TABLE FOR ALL DEVICES */}
      <div className="flex-1 bg-zinc-950/30 overflow-y-auto overflow-x-auto custom-scrollbar w-full max-h-[calc(100vh-250px)] relative">
         <table className="w-full text-left border-collapse text-sm">
           <thead className="sticky top-0 z-20 shadow-md shadow-black/20">
             <tr>
               {renderHeader("Nome Completo", "fullName")}
               {renderHeader("Telefone", "phone")}
               {renderHeader("País", "country", false, true)} {/* Hide on Mobile */}
               {renderHeader("MAC Address", "macAddress", false, true)} {/* Hide on Mobile */}
               {renderHeader("Data Início", "entryDate", false, true)} {/* Hide on Mobile */}
               {renderHeader("Duração", "subscriptionDays", false, true)} {/* Hide on Mobile */}
               {renderHeader("Status", "isPaid", true)}
               <th className="px-1.5 py-0.5 bg-zinc-900 border-b border-zinc-800 w-[70px] text-xs">Ações</th>
             </tr>
           </thead>
           <tbody>
             {processedClients.length === 0 ? (
               <tr><td colSpan={8} className="text-center py-10 text-zinc-500">Nenhum cliente encontrado.</td></tr>
             ) : (
               processedClients.map(client => {
                 const cleanPhone = client.phone ? client.phone.replace(/\D/g, '') : '';
                 return (
                  <tr key={client.id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-1.5 py-0.5 border-b border-zinc-800/50 text-zinc-100 font-medium text-sm whitespace-nowrap">
                        {client.fullName}
                      </td>
                      <td className="px-1.5 py-0.5 border-b border-zinc-800/50 text-zinc-300 text-sm whitespace-nowrap">
                         {cleanPhone ? (
                           <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-500 flex items-center gap-0.5 transition-colors">
                              <Phone size={12} />
                              {client.phone}
                           </a>
                         ) : (
                            client.phone || '-'
                         )}
                      </td>
                      <td className="hidden md:table-cell px-1.5 py-0.5 border-b border-zinc-800/50 text-zinc-400 text-xs whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Globe size={12} className="text-zinc-600" />
                          {client.country}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-1.5 py-0.5 border-b border-zinc-800/50 whitespace-nowrap">
                        <span className="font-mono text-xs bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 select-all">
                            {client.macAddress || '---'}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-1.5 py-0.5 border-b border-zinc-800/50 text-zinc-400 text-xs whitespace-nowrap">
                         {new Date(client.entryDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="hidden md:table-cell px-1.5 py-0.5 border-b border-zinc-800/50 text-zinc-400 text-xs whitespace-nowrap">
                         {client.subscriptionDays} dias
                      </td>
                      <td className="px-1.5 py-0.5 border-b border-zinc-800/50 whitespace-nowrap">
                         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${
                            client.subscriptionDays <= 0
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : client.isPaid 
                              ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {client.subscriptionDays <= 0 ? 'Não Ativo' : client.isPaid ? 'Ativo' : 'Pendente'}
                         </span>
                      </td>
                      <td className="px-1.5 py-0.5 border-b border-zinc-800/50 sticky right-0 bg-zinc-950/80 backdrop-blur-sm group-hover:bg-zinc-900/80 transition-colors z-10 whitespace-nowrap">
                         <div className="flex gap-1">
                            <button 
                              onClick={() => onEdit(client)}
                              className="p-1 text-zinc-500 hover:text-primary-400 hover:bg-zinc-800 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={() => onDelete(client.id)}
                              className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={14} />
                            </button>
                         </div>
                      </td>
                  </tr>
               );})
             )}
           </tbody>
         </table>
      </div>
    </div>
  );
};