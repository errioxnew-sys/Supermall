import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, X, KeyRound, Sparkles } from 'lucide-react';
import { useAuth, SUPERUSER_CONFIG } from '../context/AuthContext.tsx';

interface SuperAdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNavigate?: () => void;
}

export const SuperAdminLoginModal: React.FC<SuperAdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessNavigate,
}) => {
  const { loginAsSuperuser, isSuperuser } = useAuth();
  const [password, setPassword] = useState(SUPERUSER_CONFIG.defaultPassword);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginAsSuperuser(password);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          if (onSuccessNavigate) {
            onSuccessNavigate();
          }
        }, 600);
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-md w-full overflow-hidden">
        {/* Modal Header */}
        <div className="bg-stone-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white leading-tight">
                Super Admin Authentication
              </h3>
              <p className="text-xs text-stone-400">SuperMall Platform Superuser</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-stone-900">Superuser Authenticated!</h4>
              <p className="text-xs text-stone-600">
                Granting full administrative access for <strong>{SUPERUSER_CONFIG.email}</strong>...
              </p>
            </div>
          ) : (
            <>
              {/* Superuser Information Card */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Configured Superuser Profile</span>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1 border-t border-amber-200/60 text-stone-700">
                  <span className="text-stone-500">Superuser:</span>
                  <span className="col-span-2 font-mono font-medium text-stone-900">{SUPERUSER_CONFIG.email}</span>
                  <span className="text-stone-500">Authority:</span>
                  <span className="col-span-2 text-emerald-700 font-semibold">Super Administrator (Full Access)</span>
                  <span className="text-stone-500">Default Key:</span>
                  <span className="col-span-2 font-mono text-amber-800">{SUPERUSER_CONFIG.defaultPassword}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Superuser Email
                  </label>
                  <input
                    type="email"
                    value={SUPERUSER_CONFIG.email}
                    readOnly
                    className="w-full px-3.5 py-2 text-sm bg-stone-100 border border-stone-200 rounded-xl text-stone-700 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
                    <span>Superuser Passkey</span>
                    <span className="text-[11px] text-amber-700 font-normal">Pre-filled</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter passkey"
                      className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md shadow-amber-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <span>Authenticating...</span>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Authorize Super Admin Session</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-stone-500">
                    Your session will remain authenticated across page reloads.
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
