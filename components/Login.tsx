import React, { useState } from 'react';
import { LayoutGrid, Lock, User, ArrowRight } from 'lucide-react';
import { authAPI } from '../src/api';

interface LoginProps {
  onLogin: (status: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const logoCandidates = [
    `${import.meta.env.BASE_URL}logo/logo.png`,
    `${import.meta.env.BASE_URL}logo/cr-logo.png`,
  ];
  const [logoIndex, setLogoIndex] = useState(0);
  const [logoUnavailable, setLogoUnavailable] = useState(false);

  const handleLogoError = () => {
    setLogoIndex((prev) => {
      const next = prev + 1;
      if (next >= logoCandidates.length) {
        setLogoUnavailable(true);
        return prev;
      }
      return next;
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authAPI.login(username, password);
      const token = data?.token || data?.data?.token;
      if (token) {
        localStorage.setItem('crm_token', token);
        localStorage.setItem('crm_auth', 'true');
        onLogin(true);
      } else {
        setError('Resposta inválida do servidor');
      }
    } catch (err: any) {
      console.error('Login failed', err);
      setError(err?.response?.data?.message || 'Credenciais inválidas. Verifique com o administrador.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 text-base rounded-lg border border-zinc-300 dark:border-zinc-800 px-4 pl-11 placeholder-zinc-400 dark:placeholder-zinc-700 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-sm h-12";
  const iconWrapperClass = "absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-500 pointer-events-none";

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-2xl shadow-2xl shadow-zinc-900/10 dark:shadow-black/50 w-full max-w-md relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-800 via-primary-500 to-primary-800"></div>

        <div className="flex flex-col items-center mb-10 mt-2">
          <div className="bg-primary-600/20 p-4 rounded-2xl border border-primary-500/20 mb-6 shadow-lg shadow-primary-900/20">
            {logoUnavailable ? (
              <LayoutGrid size={56} className="text-primary-500" />
            ) : (
              <img
                src={logoCandidates[logoIndex]}
                alt="Logo"
                className="w-14 h-14 object-contain"
                onError={handleLogoError}
              />
            )}
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight text-center">
            Bem-vindo ao <br />CR TECH
          </h1>
          <p className="text-zinc-600 dark:text-zinc-500 text-sm mt-3 text-center max-w-xs">
            Faça login para acessar o painel de gerenciamento.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className={`${iconWrapperClass} group-focus-within:text-primary-500 transition-colors`} size={20} />
              <input 
                type="text"
                name="username"
                autoComplete="username"
                autoCapitalize="none"
                placeholder="Usuário"
                className={inputClass}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="relative group">
              <Lock className={`${iconWrapperClass} group-focus-within:text-primary-500 transition-colors`} size={20} />
              <input 
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Senha"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm font-medium text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20 animate-fadeIn">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white py-3.5 px-4 rounded-xl text-lg font-bold shadow-lg shadow-primary-900/30 transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
          >
            <span>Entrar no Sistema</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 dark:text-zinc-600 text-xs">
            Versão 2.1 &bull; CRM Dashboard Seguro
          </p>
        </div>
      </div>
    </div>
  );
};