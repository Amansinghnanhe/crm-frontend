// src/pages/LeadDashboard.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST';
}

interface Activity {
  id: number;
  activityType: 'CALL' | 'EMAIL' | 'MEETING';
  details: string;
  recordedByEmail: string;
}

interface Props {
  token: string;
  onLogout: () => void;
}

/* Status gradient pills */
const STATUS_GRADIENT: Record<string, string> = {
  NEW:       'from-cyan-500 to-blue-500',
  CONTACTED: 'from-yellow-500 to-orange-500',
  QUALIFIED: 'from-green-500 to-emerald-500',
  LOST:      'from-red-500 to-pink-500',
};

/* Status outline badges (lead list) */
const STATUS_BADGE: Record<string, string> = {
  NEW:       'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
  CONTACTED: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30',
  QUALIFIED: 'bg-green-500/15 text-green-300 border border-green-500/30',
  LOST:      'bg-red-500/15 text-red-300 border border-red-500/30',
};

/* Avatar colour pairs */
const AVATAR_STYLES = [
  'bg-violet-500/25 text-violet-300',
  'bg-cyan-500/25   text-cyan-300',
  'bg-fuchsia-500/25 text-fuchsia-300',
  'bg-emerald-500/25 text-emerald-300',
  'bg-amber-500/25   text-amber-300',
];

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

/* Reusable glass-panel class strings */
const GLASS_DARK  = 'bg-black/45 backdrop-blur-[36px] border border-white/10';
const GLASS_PANEL = 'bg-black/40 backdrop-blur-[36px] border border-white/10';
const GLASS_INPUT = 'bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-violet-500/60 transition-colors rounded-2xl';

const LeadDashboard: React.FC<Props> = ({ token, onLogout }) => {

  const [leads, setLeads]               = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities]     = useState<Activity[]>([]);

  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [activityType, setActivityType] = useState<'CALL' | 'EMAIL' | 'MEETING'>('CALL');
  const [details,      setDetails]      = useState('');
  const [agentEmail,   setAgentEmail]   = useState('sales.agent@crm.com');

  const API = 'http://localhost:8080/api/v1/leads';
  const headers = { Authorization: `Bearer ${token}` };

  const fetchLeads = async () => {
    const res = await axios.get(API, { headers });
    setLeads(res.data);
  };

  const fetchActivities = async (id: number) => {
    const res = await axios.get(`${API}/${id}/activities`, { headers });
    setActivities(res.data);
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    fetchActivities(lead.id);
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(API, { name, email, phone, status: 'NEW' }, { headers });
    setName(''); setEmail(''); setPhone('');
    fetchLeads();
  };

  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    await axios.post(
      `${API}/${selectedLead.id}/activities`,
      { activityType, details, recordedByEmail: agentEmail },
      { headers }
    );
    setDetails('');
    fetchActivities(selectedLead.id);
  };

  /* ── stat cards data ── */
  const stats = [
    { label: 'Total Leads',       value: leads.length,                                         sub: '' },
    { label: 'New / Uncontacted', value: leads.filter((l) => l.status === 'NEW').length,       sub: 'uncontacted' },
    { label: 'Qualified',         value: leads.filter((l) => l.status === 'QUALIFIED').length, sub: 'ready to close' },
    { label: 'Activities',        value: activities.length,                                    sub: 'interactions total' },
  ];

  /* ══════════════════════════════════════════════════ RENDER ══ */
  return (
    <div className="h-full text-white flex flex-col">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-lg font-bold shadow-[0_0_20px_rgba(168,85,247,0.55)]">
            ⚡
          </div>
          <div>
            <h1 className="text-[28px] font-bold tracking-tight leading-none bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
              leadflux
            </h1>
            <p className="text-white/40 text-xs mt-0.5">Manage leads &amp; activities</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-500/20 border border-red-500/25 text-red-300 hover:bg-red-500/30 transition-all text-sm font-semibold"
        >
          ⊕ Logout
        </button>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-4 gap-3 mb-4 flex-shrink-0">
        {stats.map((s, i) => (
          <div key={i} className={`${GLASS_DARK} rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)]`}>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[1px]">{s.label}</p>
            <h2 className="text-5xl font-bold mt-1 leading-none">{s.value}</h2>
            {s.sub && <p className="text-[10px] text-white/25 mt-2">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-4 flex-1 min-h-0">

        {/* ════ LEFT PANEL ════ */}
        <div className={`${GLASS_PANEL} rounded-2xl flex flex-col overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]`}>

          {/* Add Lead */}
          <div className="p-4 border-b border-white/[0.07] flex-shrink-0">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[1px] mb-3">Add Lead</p>
            <form onSubmit={handleAddLead} className="space-y-2.5">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${GLASS_INPUT} w-full px-4 py-3 text-sm`}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${GLASS_INPUT} w-full px-4 py-3 text-sm`}
              />
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`${GLASS_INPUT} w-full px-4 py-3 text-sm`}
              />
              <button
                type="submit"
                className="w-full py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-fuchsia-500 to-violet-500 shadow-[0_0_22px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                + Add Lead
              </button>
            </form>
          </div>

          {/* Leads list */}
          <div className="flex-1 overflow-y-auto p-3">
            <p className="text-[10px] font-bold text-white/35 uppercase tracking-[1px] mb-3 px-1">Leads</p>
            <div className="space-y-2">
              {leads.map((lead, idx) => (
                <div
                  key={lead.id}
                  onClick={() => handleSelectLead(lead)}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                    ${selectedLead?.id === lead.id
                      ? 'bg-violet-500/20 border border-violet-500/35'
                      : 'bg-white/[0.05] border border-white/[0.07] hover:bg-white/[0.09]'}
                  `}
                >
                  {/* avatar */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${AVATAR_STYLES[idx % AVATAR_STYLES.length]}`}>
                    {getInitials(lead.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{lead.name}</p>
                    <p className="text-xs text-white/40 truncate">{lead.email}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_BADGE[lead.status]}`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════ RIGHT PANEL ════ */}
        <div className={`${GLASS_PANEL} rounded-2xl flex flex-col overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]`}>

          {!selectedLead ? (

            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <div className="text-6xl">✨</div>
              <h2 className="text-xl font-bold text-white/70">Select a Lead</h2>
              <p className="text-sm text-white/35">Click any lead to view details</p>
            </div>

          ) : (
            <>
              {/* Detail header */}
              <div className="p-5 border-b border-white/[0.07] flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${AVATAR_STYLES[leads.findIndex(l => l.id === selectedLead.id) % AVATAR_STYLES.length]}`}>
                      {getInitials(selectedLead.name)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedLead.name}</h2>
                      <p className="text-sm text-white/40 mt-0.5">{selectedLead.email}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${STATUS_GRADIENT[selectedLead.status]}`}>
                    {selectedLead.status}
                  </div>
                </div>
              </div>

              {/* Log Activity */}
              <div className="p-5 border-b border-white/[0.07] flex-shrink-0">
                <p className="text-[10px] font-bold text-white/35 uppercase tracking-[1px] mb-3">Log Activity</p>
                <form onSubmit={handleLogActivity} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value as any)}
                      className={`${GLASS_INPUT} px-4 py-3 text-sm`}
                    >
                      <option value="CALL">CALL</option>
                      <option value="EMAIL">EMAIL</option>
                      <option value="MEETING">MEETING</option>
                    </select>
                    <input
                      type="email"
                      value={agentEmail}
                      onChange={(e) => setAgentEmail(e.target.value)}
                      className={`${GLASS_INPUT} px-4 py-3 text-sm`}
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Activity details..."
                    className={`${GLASS_INPUT} w-full px-4 py-3 text-sm resize-none`}
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-fuchsia-500 to-violet-500 shadow-[0_0_22px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-[0.99] transition-all"
                  >
                    Save Activity
                  </button>
                </form>
              </div>

              {/* Activity timeline */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                <p className="text-[10px] font-bold text-white/35 uppercase tracking-[1px] mb-3">🕐 Activity Timeline</p>
                {activities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-28 gap-1">
                    <p className="text-sm text-white/35">No activities yet</p>
                    <p className="text-xs text-white/20">Log your first interaction above</p>
                  </div>
                ) : (
                  activities
                    .slice()
                    .reverse()
                    .map((a) => (
                      <div
                        key={a.id}
                        className="p-4 rounded-xl bg-white/[0.05] border border-white/[0.07]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/25">
                            {a.activityType}
                          </span>
                          <span className="text-xs text-white/35">{a.recordedByEmail}</span>
                        </div>
                        <p className="text-sm text-white/75">{a.details}</p>
                      </div>
                    ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDashboard;