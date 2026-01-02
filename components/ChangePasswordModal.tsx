import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { authAPI } from '../src/api';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<Props> = ({ open, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('A confirmação da nova senha não confere');
      return;
    }
    if (newPassword.length < 8) {
      setError('A nova senha deve ter ao menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.changePassword(currentPassword, newPassword);
      if (res?.success) {
        setSuccess('Senha alterada com sucesso');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // close after a short delay
        setTimeout(() => onClose(), 1000);
      } else {
        setError(res?.message || 'Erro ao alterar senha');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary-600/10 p-2 rounded-md">
              <Lock className="text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Alterar Senha</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Senha atual</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full mt-1 p-2 rounded bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100" />
          </div>

          <div>
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Nova senha</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full mt-1 p-2 rounded bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100" />
          </div>

          <div>
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Confirmar nova senha</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full mt-1 p-2 rounded bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100" />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}
          {success && <div className="text-green-400 text-sm">{success}</div>}

          <div className="flex gap-2 mt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-900 dark:text-zinc-100">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded">{loading ? 'Salvando...' : 'Alterar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
