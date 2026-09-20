import React, { useState } from 'react';
import { loginAdmin } from '../services/authService';
import { ShieldCheck, Mail, Lock, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { AttributionFooter } from './AttributionFooter';

interface LoginViewProps {
  onSuccessLogin: () => void;
  onBackToDashboard: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccessLogin,
  onBackToDashboard,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await loginAdmin(email, password);
      setIsLoading(false);
      onSuccessLogin();
    } catch (err: any) {
      setIsLoading(false);
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrorMessage('Invalid admin email or password.');
      } else {
        setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between p-6 md:p-12">
      <div className="max-w-md mx-auto w-full space-y-8 my-auto">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Showcase</span>
          </button>

          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-2xl">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            ScreenCraft AI Admin Login
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Sign in with your authorized Firebase admin credentials to manage projects and showcase case studies.
          </p>
        </div>

        {/* Login Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 md:p-8 space-y-5 shadow-2xl"
        >
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admin Email</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@screencraft.ai"
              className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold text-xs md:text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Admin Portal</span>
            )}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-500">
          Public registration is disabled. Admin accounts are authorized via Firebase Authentication.
        </p>
      </div>

      <AttributionFooter className="mt-8 rounded-2xl border border-slate-900" />
    </div>
  );
};
