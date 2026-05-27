import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeadDashboard = ({ token, onLogout }: { token: string, onLogout: () => void }) => {
  const [leads, setLeads] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  // 🔥 ACTIVITIES STATES
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [activities, setActivities] = useState([]);
  const [activityType, setActivityType] = useState('CALL');
  const [details, setDetails] = useState('');

  const API_URL = 'http://localhost:8080/api/v1/leads';

  // 1. Fetch All Leads
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

  // 2. Fetch Activities for a Specific Lead
  const fetchActivities = async (leadId: number) => {
    try {
      const res = await axios.get(`${API_URL}/${leadId}/activities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(res.data);
    } catch (err: any) {
      console.error("Error fetching activities", err);
    }
  };

  // 3. Add New Lead
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(API_URL, 
        { name, email, phone, status: "NEW" }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLeads(); 
      setName(''); setEmail(''); setPhone('');
    } catch (err: any) { 
      setError(err.response?.data?.message || "Lead add nahi hui!");
    }
  };

  // 4. Log New Activity
  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    try {
      await axios.post(`${API_URL}/${selectedLead.id}/activities`, 
        { 
          activityType, 
          details, 
          recordedByEmail: "sales.agent@crm.com" 
        }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDetails(''); 
      fetchActivities(selectedLead.id); 
    } catch (err: any) {
      console.error("Activity log nahi hui", err);
      setError("Activity save nahi ho payi. Auth status check karein (403 Forbidden).");
    }
  };

  const handleSelectLead = (lead: any) => {
    setSelectedLead(lead);
    fetchActivities(lead.id); 
  };

  useEffect(() => { fetchLeads(); }, []);

  return (
    <div className="text-white w-full max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-blue-400 drop-shadow">📊 CRM Dashboard</h2>
        <button onClick={onLogout} className="bg-red-600 px-5 py-2 rounded-xl hover:bg-red-500 transition font-medium">
          Logout
        </button>
      </div>
      
      {error && <p className="text-red-400 mb-6 bg-red-400/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

      {/* Grid Layout Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full">
        
        {/* ================= LEFT SIDE: LEADS MODULE ================= */}
        <div className="space-y-6 w-full">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-slate-300">Add New Lead</h3>
            <form onSubmit={handleAddLead} className="space-y-4 bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
              <input className="w-full p-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-blue-500 text-white text-sm" 
                     placeholder="Lead Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input className="w-full p-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-blue-500 text-white text-sm" 
                     placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input className="w-full p-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-blue-500 text-white text-sm" 
                     placeholder="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <button type="submit" className="w-full bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 text-sm">
                Add Lead
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-slate-300">Leads List (Click to view history)</h3>
            <ul className="space-y-3">
              {leads.map((lead: any) => (
                <li 
                  key={lead.id} 
                  onClick={() => handleSelectLead(lead)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex justify-between items-center shadow-md ${
                    selectedLead?.id === lead.id 
                      ? 'bg-blue-600/30 border-blue-500 shadow-blue-500/10' 
                      : 'bg-black/30 backdrop-blur-sm border-white/10 hover:border-slate-500'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <strong className="block text-white truncate text-sm">{lead.name}</strong>
                    <span className="text-slate-400 text-xs truncate block">{lead.email}</span>
                  </div>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md uppercase font-bold tracking-wider shrink-0">
                    {lead.status || "NEW"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ================= RIGHT SIDE: FIXED & IMPROVED ACTIVITIES TIMELINE ================= */}
        <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 h-fit w-full shadow-xl">
          {selectedLead ? (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-1 break-words">Timeline for {selectedLead.name}</h3>
                <p className="text-xs text-slate-400 break-all">Email: {selectedLead.email}</p>
              </div>

              {/* Form: Log New Activity */}
              <form onSubmit={handleLogActivity} className="space-y-4 bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Activity Type</label>
                  <select 
                    value={activityType} 
                    onChange={(e) => setActivityType(e.target.value)}
                    className="w-full p-3 bg-black/60 border border-white/10 rounded-xl outline-none text-sm text-slate-200 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="CALL">📞 Call</option>
                    <option value="EMAIL">📧 Email</option>
                    <option value="MEETING">🤝 Meeting</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Activity Details</label>
                  <textarea 
                    className="w-full p-3 bg-black/60 border border-white/10 rounded-xl outline-none focus:border-blue-500 text-white text-sm resize-none" 
                    placeholder="Kya baat-cheet hui? Details yahan likhein..." 
                    value={details} 
                    onChange={(e) => setDetails(e.target.value)} 
                    rows={3}
                    required 
                  />
                </div>

                <button type="submit" className="w-full bg-emerald-600 py-3 rounded-xl font-bold text-sm hover:bg-emerald-500 transition text-white shadow-lg shadow-emerald-900/20">
                  Log Activity
                </button>
              </form>

              {/* List: Activity History */}
              <div className="pt-2">
                <h4 className="font-semibold text-xs text-slate-400 mb-3 uppercase tracking-wider">Past Activities</h4>
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {activities.length === 0 ? (
                    <p className="text-slate-500 text-xs italic bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                      No activities recorded yet for this lead.
                    </p>
                  ) : (
                    activities.map((act: any) => (
                      <div key={act.id} className="p-3 bg-black/50 rounded-xl border border-white/5 space-y-2">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 shrink-0">
                            {act.activityType}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate">{act.recordedByEmail}</span>
                        </div>
                        <p className="text-sm text-slate-300 bg-black/20 p-2 rounded-lg break-words">{act.details}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[350px] flex flex-col justify-center items-center text-center p-4">
              <span className="text-4xl mb-3 animate-pulse">👈</span>
              <h3 className="text-lg font-medium text-slate-300">No Lead Selected</h3>
              <p className="text-xs text-slate-500 max-w-[220px] mt-1">
                Kisi bhi lead par click karke uski puri activity history aur follow-ups check karein.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LeadDashboard;