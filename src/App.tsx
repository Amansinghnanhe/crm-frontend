import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import LeadDashboard from './pages/LeadDashboard';

function App() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isLoginTab ? 'http://localhost:8080/api/v1/auth/login' : 'http://localhost:8080/api/v1/auth/register';
    const body = isLoginTab ? { email, password } : { name, email, password, role: 'USER' };
    
    try {
      const res = await axios.post(url, body);
      if (isLoginTab) {
        setToken(res.data.token);
      } else {
        setMessage("Registration successful! Please login.");
        setIsLoginTab(true);
      }
    } catch (err: any) { setMessage(err.response?.data?.message || 'Error!'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#030712]">
      <div className="bg-slate-900/50 backdrop-blur-2xl p-8 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl">
        
        {token ? (
          <LeadDashboard token={token} onLogout={() => setToken('')} />
        ) : (
          <>
            <div className="flex mb-8 bg-black/30 p-1.5 rounded-2xl">
              <button className={`flex-1 py-3 rounded-xl font-bold ${isLoginTab ? 'bg-blue-600' : 'text-slate-400'}`} onClick={() => setIsLoginTab(true)}>Login</button>
              <button className={`flex-1 py-3 rounded-xl font-bold ${!isLoginTab ? 'bg-blue-600' : 'text-slate-400'}`} onClick={() => setIsLoginTab(false)}>Register</button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLoginTab && <div className="relative"><User className="absolute left-3 top-3.5 text-slate-500" size={20} /><input type="text" placeholder="Name" className="w-full pl-10 p-3 bg-black/40 border border-white/10 rounded-xl text-white outline-none" value={name} onChange={(e) => setName(e.target.value)} required /></div>}
              <div className="relative"><Mail className="absolute left-3 top-3.5 text-slate-500" size={20} /><input type="email" placeholder="Email" className="w-full pl-10 p-3 bg-black/40 border border-white/10 rounded-xl text-white outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div className="relative"><Lock className="absolute left-3 top-3.5 text-slate-500" size={20} /><input type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full pl-10 pr-10 p-3 bg-black/40 border border-white/10 rounded-xl text-white outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-500">{showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}</button></div>
              <button type="submit" className="w-full bg-blue-600 py-3 rounded-xl font-bold text-white transition-all">Submit</button>
            </form>
            {message && <p className="mt-4 text-center text-sm text-blue-400">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
}
export default App;