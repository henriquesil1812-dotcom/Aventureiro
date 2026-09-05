import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle,
  HelpCircle,
  X,
  KeyRound,
  UserCheck
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, users, requestPasswordReset, setUserPassword, clubSettings } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Password Setup / First Access modal state
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupEmail, setSetupEmail] = useState('');
  const [setupCode, setSetupCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [setupError, setSetupError] = useState('');
  const [setupSuccess, setSetupSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Por favor, informe seu email de acesso.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    const targetUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    
    // If target user exists and has no password configured yet, prompt for setup
    if (targetUser && !targetUser.password) {
      setLoading(false);
      openSetupModalFor(targetUser.email);
      return;
    }

    setTimeout(() => {
      const ok = login(email, password);
      setLoading(false);
      if (!ok) {
        if (targetUser && targetUser.password && password && targetUser.password !== password) {
          setErrorMsg('Senha incorreta. Se esqueceu, clique em "Esqueci minha senha" ou cadastre uma nova.');
        } else {
          setErrorMsg('Email não encontrado no sistema. Verifique o endereço digitado.');
        }
      }
    }, 350);
  };

  const openSetupModalFor = (userEmail: string) => {
    setSetupEmail(userEmail);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSetupCode(code);
    setNewPass('');
    setConfirmPass('');
    setSetupError('');
    setSetupSuccess(false);
    setShowSetupModal(true);
  };

  const handleQuickLogin = (userEmail: string) => {
    const targetUser = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
    if (targetUser && !targetUser.password) {
      // Prompt password setup immediately as requested
      openSetupModalFor(userEmail);
      return;
    }

    setEmail(userEmail);
    setPassword('••••••••');
    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      login(userEmail);
      setLoading(false);
    }, 300);
  };

  const handleSetupPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');

    if (newPass.length < 4) {
      setSetupError('A senha deve conter pelo menos 4 caracteres.');
      return;
    }

    if (newPass !== confirmPass) {
      setSetupError('As senhas digitadas não coincidem.');
      return;
    }

    const saved = setUserPassword(setupEmail, newPass);
    if (saved) {
      setSetupSuccess(true);
      setTimeout(() => {
        setShowSetupModal(false);
        login(setupEmail, newPass);
      }, 1200);
    } else {
      setSetupError('Erro ao registrar senha. Certifique-se de que o email está cadastrado.');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#12072B] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 overflow-hidden select-none">
      
      {/* Dynamic Starry Sky Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#180838] via-[#240B4F] to-[#0F0422] -z-10" />
      
      {/* Decorative stars / twinkling particles */}
      <div className="absolute top-12 left-10 w-2 h-2 bg-amber-300 rounded-full blur-[1px] animate-pulse" />
      <div className="absolute top-28 right-24 w-2.5 h-2.5 bg-amber-200 rounded-full blur-[1px] animate-ping opacity-60" />
      <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-amber-400 rounded-full blur-[1px] animate-pulse" />
      <div className="absolute bottom-24 left-16 w-3 h-3 bg-amber-300/60 rounded-full blur-[2px]" />
      <div className="absolute bottom-32 right-12 w-2 h-2 bg-purple-300 rounded-full opacity-70" />
      <div className="absolute top-10 right-1/3 w-1 h-1 bg-white rounded-full opacity-90" />
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-amber-100 rounded-full" />

      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-md my-auto">
        
        {/* Brand Header */}
        <div className="text-center mb-6 sm:mb-8">
          {/* Emblem with Golden Border */}
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-purple-900/80 to-purple-950 border-2 border-amber-400/60 shadow-xl shadow-amber-500/10 mb-3 relative group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-purple-950 font-black shadow-inner">
              <Sparkles className="w-7 h-7 text-purple-950" />
            </div>
            <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-purple-950 font-extrabold text-[10px] tracking-wider uppercase shadow">
              Clube Oficial
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif mt-2">
            {clubSettings.clubName || 'Herança do Céu'}
          </h1>
          <p className="text-amber-300 font-medium text-xs sm:text-sm tracking-wide mt-1">
            {clubSettings.clubSubtitle || 'Clube de Aventureiros • Painel da Liderança'}
          </p>
        </div>

        {/* Card Login */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/50 border border-purple-100/20 backdrop-blur text-slate-800">
          
          <div className="mb-5">
            <h2 className="text-lg font-bold text-purple-950 font-serif">
              Acesso ao Sistema
            </h2>
            <p className="text-xs text-slate-500">
              Digite suas credenciais de liderança para continuar.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2 animate-shake">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="henriquesil1812@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Senha
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => openSetupModalFor(email.trim() || 'henriquesil1812@gmail.com')}
                    className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 transition-colors"
                  >
                    Cadastrar / Redefinir Senha
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha cadastrada"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-sm shadow-md shadow-purple-900/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* User Quick Access */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
              Acesso Rápido de Liderança:
            </p>
            <div className="grid grid-cols-1 gap-2">
              
              {/* Henrique Admin User */}
              <button
                type="button"
                onClick={() => handleQuickLogin('henriquesil1812@gmail.com')}
                className="flex items-center justify-between p-3 rounded-xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-purple-50 hover:from-amber-100 hover:to-purple-100 text-left transition-all group shadow-sm"
              >
                <div>
                  <div className="text-xs font-extrabold text-purple-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Henrique (Instrutor Admin)
                    <span className="px-1.5 py-0.2 text-[9px] bg-amber-500 text-purple-950 font-black rounded uppercase">
                      Admin Total
                    </span>
                  </div>
                  <div className="text-[11px] text-purple-800 font-mono">
                    henriquesil1812@gmail.com
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-900 group-hover:translate-x-1 transition-transform bg-white/80 px-2 py-1 rounded-lg border border-purple-200">
                  Acessar &rarr;
                </span>
              </button>

              {/* Instrutor Demo */}
              <button
                type="button"
                onClick={() => handleQuickLogin('instrutor@heranca.com')}
                className="flex items-center justify-between p-2.5 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-left transition-colors group"
              >
                <div>
                  <div className="text-xs font-bold text-purple-950 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600 mr-1" />
                    Pr. Carlos Eduardo (Instrutor)
                  </div>
                  <div className="text-[11px] text-purple-700">instrutor@heranca.com</div>
                </div>
                <span className="text-[11px] font-semibold text-purple-700 group-hover:translate-x-0.5 transition-transform">
                  Entrar &rarr;
                </span>
              </button>

              {/* Diretor Adjunto */}
              <button
                type="button"
                onClick={() => handleQuickLogin('diretor.adjunto@heranca.com')}
                className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-left transition-colors group"
              >
                <div>
                  <div className="text-xs font-bold text-emerald-950 flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                    Marcos Vinícius (Diretor Adjunto)
                  </div>
                  <div className="text-[11px] text-emerald-700">Edição concedida pelo Admin</div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                  Entrar &rarr;
                </span>
              </button>

              {/* Diretoria Geral */}
              <button
                type="button"
                onClick={() => handleQuickLogin('diretoria@heranca.com')}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center">
                    <Lock className="w-3.5 h-3.5 text-slate-500 mr-1" />
                    Helena Ribeiro (Diretoria)
                  </div>
                  <div className="text-[11px] text-slate-500">Somente leitura</div>
                </div>
                <span className="text-[11px] font-semibold text-slate-600 group-hover:translate-x-0.5 transition-transform">
                  Entrar &rarr;
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-purple-300/70 space-y-1">
          <p className="font-serif italic">
            "{clubSettings.clubMotto || 'Por amor a Jesus, farei sempre o meu melhor!'}"
          </p>
          <p className="text-[11px] text-purple-400/60">
            {clubSettings.associationDistrict ? `${clubSettings.associationDistrict} • ` : ''}Painel Oficial da Liderança
          </p>
        </div>
      </div>

      {/* Password Setup / First Access Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-900 relative">
            <button
              onClick={() => setShowSetupModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-purple-900 mb-3">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Cadastrar / Definir Senha</h3>
                <p className="text-xs text-slate-500">Primeiro Acesso do Administrador</p>
              </div>
            </div>

            {!setupSuccess ? (
              <form onSubmit={handleSetupPasswordSubmit} className="space-y-3.5">
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 leading-relaxed">
                  <p className="font-bold mb-0.5">Olá, Administrador!</p>
                  Defina a sua senha pessoal para o email <strong className="font-mono">{setupEmail}</strong>.
                </div>

                {setupCode && (
                  <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                    <span className="text-amber-900 font-medium">Código de Autorização:</span>
                    <span className="font-mono font-black text-amber-800 text-sm tracking-widest">{setupCode}</span>
                  </div>
                )}

                {setupError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {setupError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email de Acesso
                  </label>
                  <input
                    type="email"
                    value={setupEmail}
                    onChange={(e) => setSetupEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Mínimo 4 dígitos ou caracteres"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-purple-900 text-white font-bold text-sm hover:bg-purple-950 transition-colors shadow-lg shadow-purple-900/20 cursor-pointer"
                >
                  Salvar Senha e Entrar no Painel
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-slate-900">Senha Cadastrada com Sucesso!</h4>
                <p className="text-xs text-slate-600">
                  Sua nova credencial foi gravada. Redirecionando para o painel de liderança...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
