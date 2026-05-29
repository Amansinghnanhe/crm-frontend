// App.tsx

import React, { useState } from 'react';
import axios from 'axios';

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from 'lucide-react';

import LeadDashboard from './pages/LeadDashboard';

function App() {

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [token, setToken]           = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage]       = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = isLoginTab
      ? 'http://localhost:8080/api/v1/auth/login'
      : 'http://localhost:8080/api/v1/auth/register';

    const body = isLoginTab
      ? { email, password }
      : { name, email, password, role: 'USER' };

    try {
      const res = await axios.post(url, body);
      if (isLoginTab) {
        setToken(res.data.token);
      } else {
        setMessage('Registration Successful!');
        setIsLoginTab(true);
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">

      {/* ── BACKGROUND IMAGE ── */}
      <img
        src="/1703602486048.jpg"
        alt="bg"
        className="absolute inset-0 h-full w-full object-cover scale-110"
      />

      {/* ── DARK OVERLAY — makes bg darker so glass pops ── */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* ── PURPLE GLOW top-left ── */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-fuchsia-500/25 blur-[140px] pointer-events-none"></div>

      {/* ── CYAN GLOW bottom-right ── */}
      <div className="absolute bottom-[-150px] right-[-150px] w-[450px] h-[450px] rounded-full bg-cyan-500/20 blur-[140px] pointer-events-none"></div>

      {/* ── MAIN ── */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-5">

        {token ? (

          /* ════ DASHBOARD WRAPPER ════ */
          <div
            className="
              relative w-full max-w-7xl h-[92vh]
              rounded-[32px] overflow-hidden
              bg-black/55
              border border-white/10
              backdrop-blur-[48px]
              shadow-[0_8px_60px_rgba(0,0,0,0.7)]
            "
          >
            {/* top shine line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
            {/* left shine line */}
            <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
            {/* inner glass shine */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />

            <div className="relative p-6 h-full overflow-hidden">
              <LeadDashboard token={token} onLogout={() => setToken('')} />
            </div>
          </div>

        ) : (

          /* ════ LOGIN / REGISTER CARD ════ */
          <div
            className="
              relative w-full max-w-md
              rounded-[32px] overflow-hidden
              bg-black/55
              border border-white/10
              backdrop-blur-[48px]
              shadow-[0_8px_60px_rgba(0,0,0,0.7)]
              p-8
            "
          >
            {/* shine */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />

            {/* Logo */}
            <div className="relative z-10 flex items-center gap-3 mb-7">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-base font-bold shadow-[0_0_18px_rgba(168,85,247,0.55)]">
                ⚡
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent tracking-tight">
                leadflux
              </span>
            </div>

            {/* TABS */}
            <div className="relative z-10 flex bg-black/30 p-1.5 rounded-2xl border border-white/10 mb-7">
              <button
                onClick={() => setIsLoginTab(true)}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isLoginTab
                    ? 'bg-white/10 backdrop-blur-xl text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLoginTab(false)}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                  !isLoginTab
                    ? 'bg-white/10 backdrop-blur-xl text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleAuth} className="relative z-10 space-y-4">

              {!isLoginTab && (
                <div className="relative">
                  <User size={18} className="absolute left-4 top-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none placeholder:text-white/35 focus:border-fuchsia-400/60 transition-colors"
                  />
                </div>
              )}

              <div className="relative">
                <Mail size={18} className="absolute left-4 top-4 text-white/50" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none placeholder:text-white/35 focus:border-cyan-400/60 transition-colors"
                />
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-4 top-4 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none placeholder:text-white/35 focus:border-fuchsia-400/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-fuchsia-500 to-violet-500 shadow-[0_0_24px_rgba(168,85,247,0.45)] hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                {isLoginTab ? 'Login' : 'Register'}
              </button>
            </form>

            {message && (
              <p className="relative z-10 mt-4 text-center text-sm text-fuchsia-300">{message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;