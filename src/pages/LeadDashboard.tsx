import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeadDashboard = ({ token, onLogout }: { token: string, onLogout: () => void }) => {
  const [leads, setLeads] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  // Backend context-path /api/v1 ke sath URL
  const API_URL = 'http://localhost:8080/api/v1/leads';

  const fetchLeads = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(res.data);
    } catch (err: any) { 
      console.error("Error fetching leads", err);
      setError("Leads load nahi ho payi! Server ya Token check karein.");
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(API_URL, 
        { name, email, phone, status: "NEW" }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLeads(); // Data refresh
      setName(''); setEmail(''); setPhone('');
    } catch (err: any) { 
      setError(err.response?.data?.message || "Lead add nahi hui!");
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  return (
    <div className="text-white w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Leads</h2>
        <button onClick={onLogout} className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500 transition">Logout</button>
      </div>
      
      {error && <p className="text-red-400 mb-4 bg-red-400/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

      <form onSubmit={handleAddLead} className="space-y-3 mb-8 bg-black/20 p-6 rounded-2xl border border-white/5">
        <input className="w-full p-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-blue-500" 
               placeholder="Lead Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="w-full p-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-blue-500" 
               placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full p-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-blue-500" 
               placeholder="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-500 transition">Add Lead</button>
      </form>

      <ul className="space-y-3">
        {leads.map((lead: any) => (
          <li key={lead.id} className="p-4 bg-black/40 rounded-xl border border-white/10 flex justify-between">
            <span><strong>{lead.name}</strong></span>
            <span className="text-slate-400 text-sm">{lead.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default LeadDashboard;