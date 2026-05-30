// App.tsx

import React, { useState } from 'react';
import axios from 'axios'; // 🔥 Bilkul sahi aur clean import

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone, 
  KeyRound 
} from 'lucide-react';

import LeadDashboard from './pages/LeadDashboard';

function App() {

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [otp, setOtp]               = useState(''); 
  const [isOtpStep, setIsOtpStep]   = useState(false); 
  
  const [token, setToken]           = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage]       = useState('');

  // 1. REGISTER AUR LOGIN HANDLE KARNE KE LIYE
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const url = isLoginTab
      ? 'http://localhost:8080/api/v1/auth/login'
      : 'http://localhost:8080/api/v1/auth/register';

    const body = isLoginTab
      ? { email, password }
      : { name, email, password, role: 'USER', phoneNumber }; 

    try {
      const res = await axios.post(url, body); // 🔥 axios_actual hata kar sahi kar diya
      if (isLoginTab) {
        setToken(res.data.token);
      } else {
        setMessage('Registration Successful! OTP sent to your phone.');
        setIsOtpStep(true); 
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Something went wrong!');
    }
  };

  // 2. OTP VERIFY KARNE KA FUNCTION
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const url = 'http://localhost:8080/api/v1/auth/verify-otp'; 
      await axios.post(url, { email, otp }); // 🔥 axios_actual hata kar sahi kar diya

      setMessage('Account verified successfully! You can now login.');
      setIsOtpStep(false); 
      setIsLoginTab(true); 
      setOtp(''); 
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Invalid OTP! Please try again.');
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

      {/* ── DARK OVERLAY ── */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* ── PURPLE GLOW ── */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-fuchsia-500/25 blur-[140px] pointer-events-none"></div>

      {/* ── CYAN GLOW ── */}
      <div className="absolute bottom-[-150px] right-[-150px] w-[450px] h-[450px] rounded-full bg-cyan-500/20 blur-[140px] pointer-events-none"></div>

      {/* ── MAIN ── */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-5">

        {token ? (
          /* ════ DASHBOARD WRAPPER ════ */
          <div className="relative w-full max-w-7xl h-[92vh] rounded-[32px] overflow-hidden bg-black/55 border border-white/10 backdrop-blur-[48px] shadow-[0_8px_60px_rgba(0,0,0,0.7)]">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />

            <div className="relative p-6 h-full overflow-hidden">
              <LeadDashboard token={token} onLogout={() => setToken('')} />
            </div>
          </div>
        ) : (
          /* ════ LOGIN / REGISTER / OTP CARD ════ */
          <div className="relative w-full max-w-md rounded-[32px] overflow-hidden bg-black/55 border border-white/10 backdrop-blur-[48px] shadow-[0_8px_60px_rgba(0,0,0,0.7)] p-8">
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
            {!isOtpStep && (
              <div className="relative z-10 flex bg-black/30 p-1.5 rounded-2xl border border-white/10 mb-7">
                <button
                  onClick={() => { setIsLoginTab(true); setMessage(''); }}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                    isLoginTab ? 'bg-white/10 backdrop-blur-xl text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => { setIsLoginTab(false); setMessage(''); }}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                    !isLoginTab ? 'bg-white/10 backdrop-blur-xl text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Register
                </button>
              </div>
            )}

            {/* CONDITION 1: OTP STEP */}
            {isOtpStep ? (
              <form onSubmit={handleVerifyOtp} className="relative z-10 space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-white">Verify Phone Number</h3>
                  <p className="text-xs text-white/50 mt-1">Enter the 6-digit code sent to your mobile</p>
                </div>

                <div className="relative">
                  <KeyRound size={18} className="absolute left-4 top-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Enter 6-Digit OTP"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none placeholder:text-white/35 focus:border-fuchsia-400/60 text-center tracking-widest font-bold text-lg transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-fuchsia-500 to-violet-500 shadow-[0_0_24px_rgba(168,85,247,0.45)] hover:scale-[1.02] active:scale-[0.99] transition-all"
                >
                  Verify OTP &amp; Register
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsOtpStep(false)}
                  className="w-full text-center text-xs text-slate-400 hover:text-white mt-2 transition-colors"
                >
                  ← Back to Registration
                </button>
              </form>
            ) : (
              
              /* CONDITION 2: REGULAR LOGIN / REGISTER FORM */
              <form onSubmit={handleAuth} className="relative z-10 space-y-4">

                {!isLoginTab && (
                  <>
                    {/* Full Name */}
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-4 text-white/50" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none placeholder:text-white/35 focus:border-fuchsia-400/60 transition-colors"
                        required
                      />
                    </div>

                    {/* Phone Number Input */}
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-4 text-white/50" />
                      <input
                        type="text"
                        placeholder="Phone (e.g., +919876543210)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none placeholder:text-white/35 focus:border-violet-400/60 transition-colors"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Email */}
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-4 text-white/50" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none placeholder:text-white/35 focus:border-cyan-400/60 transition-colors"
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-4 text-white/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none placeholder:text-white/35 focus:border-fuchsia-400/60 transition-colors"
                    required
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
            )}

            {message && (
              <p className="relative z-10 mt-4 text-center text-sm text-fuchsia-300 bg-white/5 py-2 px-3 rounded-xl border border-white/5">{message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;