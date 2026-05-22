import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

function App() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('USER');
  
  const [isOtpScreen, setIsOtpScreen] = useState(false);
  const [isForgotFlow, setIsForgotFlow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/v1/auth/register', { name, email, password, role });
      setMessage(res.data.message);
      setIsOtpScreen(true);
    } catch (err: any) { setMessage(err.response?.data?.message || 'Error!'); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/v1/auth/login', { email, password });
      setToken(res.data.token);
      setMessage('Login successful!');
    } catch (err: any) { setMessage(err.response?.data?.message || 'Login failed!'); }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ 
        backgroundImage: `linear-gradient(rgba(3, 7, 18, 0.85), rgba(3, 7, 18, 0.85)), url('/1703602486048.jpg')`,
        backgroundSize: 'contain', // Yahan se photo cut hona band ho jayegi
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#030712' // Empty space mein dark color dikhega
      }}
    >
      <div className="bg-slate-900/50 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/10">
        
        {!isOtpScreen && !isForgotFlow && (
          <div className="flex mb-8 bg-black/30 p-1.5 rounded-2xl">
            <button className={`flex-1 py-3 rounded-xl font-bold transition-all ${isLoginTab ? 'bg-blue-600 shadow-lg' : 'text-slate-400'}`} onClick={() => setIsLoginTab(true)}>Login</button>
            <button className={`flex-1 py-3 rounded-xl font-bold transition-all ${!isLoginTab ? 'bg-blue-600 shadow-lg' : 'text-slate-400'}`} onClick={() => setIsLoginTab(false)}>Register</button>
          </div>
        )}

        <h2 className="text-3xl font-black text-white mb-6 text-center">
          {isLoginTab ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={isLoginTab ? handleLogin : handleRegister} className="space-y-4">
          {!isLoginTab && (
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-500" size={20} />
              <input type="text" placeholder="Name" className="w-full pl-10 p-3 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-500" size={20} />
            <input type="email" placeholder="Email" className="w-full pl-10 p-3 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-500" size={20} />
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full pl-10 pr-10 p-3 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-500">
              {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-600/20">
            {isLoginTab ? 'Sign In' : 'Register Now'}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-blue-400 font-medium">{message}</p>}
      </div>
    </div>
  );
}

export default App;