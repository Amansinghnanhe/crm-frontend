import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck } from 'lucide-react';
// Yahan apni image file ko import karein
import bgImage from './assets/1703602486048.jpg';

function App() {
  // Tab switch karne ke liye ('login' ya 'register')
  const [isLoginTab, setIsLoginTab] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('USER');

  // Naye flows control karne ke liye states
  const [isOtpScreen, setIsOtpScreen] = useState(false); // Register ke baad OTP dikhane ke liye
  const [isForgotFlow, setIsForgotFlow] = useState(false); // Forgot password flow chalane ke liye
  const [step, setStep] = useState(1); // Forgot password mein step 1 (Email) ya step 2 (Reset)
  const [otp, setOtp] = useState(''); // OTP input value handle karne ke liye
  const [newPassword, setNewPassword] = useState(''); // Naya password input ke liye

  // Eye Icon dynamic visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Response states
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // 🛠️ Handle User Registration
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/register', {
        name,
        email,
        password,
        role
      });

      if (response.data.success || response.status === 200) {
        setIsSuccess(true);
        setMessage(response.data.message || 'Registration successful! Please verify OTP.');
        setName('');
        setPassword('');
        setIsOtpScreen(true);
      }
    } catch (err) {
      setIsSuccess(false);
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || 'Backend server chal nahi raha hai!');
      } else {
        setMessage('An unexpected error occurred!');
      }
    }
  };

  // 🛠️ Handle User Login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setToken('');
    setIsSuccess(false);

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
        email,
        password
      });

      if (response.data.token || response.data.success) {
        setIsSuccess(true);
        setToken(response.data.token);
        setMessage(response.data.message || 'Login successful!');
      }
    } catch (err) {
      setIsSuccess(false);
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || 'Backend server chal nahi raha hai!');
      } else {
        setMessage('An unexpected error occurred!');
      }
    }
  };

  // 🛠️ Handle Account OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/verify-otp', {
        email,
        otp
      });

      if (response.data.success || response.status === 200) {
        setIsSuccess(true);
        setMessage(response.data.message || 'Account verified successfully!');
        setIsOtpScreen(false);
        setIsLoginTab(true);
        setOtp('');
      }
    } catch (err) {
      setIsSuccess(false);
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || 'Invalid OTP or Verification Failed!');
      } else {
        setMessage('An unexpected error occurred!');
      }
    }
  };

  // 🛠️ Handle Forgot Password Request
  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/forgot-password', { email });

      if (response.data.success || response.status === 200) {
        setIsSuccess(true);
        setMessage(response.data.message || 'OTP sent to your email!');
        setStep(2);
      }
    } catch (err) {
      setIsSuccess(false);
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || 'Email not found!');
      } else {
        setMessage('An unexpected error occurred!');
      }
    }
  };

  // 🛠️ Handle Reset Password Request
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/reset-password', {
        email,
        otp,
        newPassword
      });

      if (response.data.success || response.status === 200) {
        setIsSuccess(true);
        setMessage(response.data.message || 'Password reset successfully!');
        setIsForgotFlow(false);
        setStep(1);
        setOtp('');
        setNewPassword('');
        setIsLoginTab(true);
      }
    } catch (err) {
      setIsSuccess(false);
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || 'Failed to reset password!');
      } else {
        setMessage('An unexpected error occurred!');
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-6 text-white selection:bg-blue-500/30"
      style={{ 
        backgroundImage: `linear-gradient(to bottom, rgba(3, 7, 18, 0.88), rgba(15, 23, 42, 0.93)), url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop')` 
      }}
    >
      <div className="bg-slate-950/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700/30 hover:border-blue-500/20 transition-all duration-300">
        
        {!isOtpScreen && !isForgotFlow && (
          <div className="flex mb-8 bg-slate-950/60 p-1 rounded-xl border border-slate-800/60">
            <button
              type="button"
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${isLoginTab ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => { setIsLoginTab(true); setMessage(''); setToken(''); setShowPassword(false); }}
            >
              Login
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${!isLoginTab ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => { setIsLoginTab(false); setMessage(''); setToken(''); setShowPassword(false); }}
            >
              Register
            </button>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          {isOtpScreen ? 'Verify OTP' : isForgotFlow ? 'Password Recovery' : isLoginTab ? 'Welcome Back' : 'Create Account'}
        </h2>

        {isOtpScreen ? (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <p className="text-xs text-slate-400 text-center bg-slate-950/40 py-2 rounded-lg border border-slate-800/40">Enter the 6-digit OTP sent for account activation.</p>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">6-Digit OTP</label>
              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1 block w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none text-center font-bold tracking-[0.5em] text-lg transition duration-200"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold p-3 rounded-xl transition duration-300 shadow-lg shadow-blue-600/15">
              Verify Account
            </button>
            <button type="button" onClick={() => setIsOtpScreen(false)} className="w-full text-xs text-slate-400 hover:text-white text-center block pt-1 transition">
              Back to Register
            </button>
          </form>
        ) : isForgotFlow ? (
          step === 1 ? (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <p className="text-xs text-slate-400 text-center bg-slate-950/40 py-2 rounded-lg border border-slate-800/40">Enter your registered email to get password reset OTP.</p>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold p-3 rounded-xl transition duration-300 shadow-lg shadow-indigo-600/15">
                Send Reset OTP
              </button>
              <button type="button" onClick={() => setIsForgotFlow(false)} className="w-full text-xs text-slate-400 hover:text-white text-center block pt-1 transition">
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">OTP Received</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3.5 text-slate-500" size={18} />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-10 block w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none font-bold tracking-widest text-center"
                    placeholder="000000"
                    maxLength={6}
                    required
                />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 block w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition duration-200"
                    placeholder="Enter new password"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold p-3 rounded-xl transition duration-300 shadow-lg shadow-emerald-600/15">
                Update Password
              </button>
            </form>
          )
        ) : (
          isLoginTab ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 block w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition duration-200"
                    placeholder="Enter password"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button 
                  type="button" 
                  onClick={() => { setIsForgotFlow(true); setStep(1); setMessage(''); setShowPassword(false); }}
                  className="text-xs text-blue-400 hover:underline hover:text-blue-300 transition-all duration-200"
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold p-3 rounded-xl transition duration-300 shadow-lg shadow-blue-600/15">
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-slate-500" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 block w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition duration-200"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition duration-200"
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 block w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition duration-200"
                    placeholder="Min 6 characters"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold p-3 rounded-xl transition duration-300 shadow-lg shadow-emerald-600/15">
                Register Now
              </button>
            </form>
          )
        )}

        {message && (
          <div className={`mt-6 p-3 rounded-xl text-center text-xs font-medium transition-all duration-300 ${isSuccess ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {message}
          </div>
        )}

        {token && (
          <div className="mt-6 p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl text-[11px] break-all shadow-inner">
            <span className="font-bold text-blue-400 block mb-1 uppercase tracking-wider text-[10px]">Live JWT Token Received:</span>
            <span className="text-slate-400 font-mono">{token}</span>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;