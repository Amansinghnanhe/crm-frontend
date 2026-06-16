import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, FileText, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
// 💡 FIXED: Interface ko import type ke roop mein kiya gaya hai
import type { DashboardStats } from '../types/dashboard';
import { getDashboardStats, getDashboardLeads } from '../services/dashboardService';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST' | 'IN_PROGRESS';
  assignedToAgentName: string; 
}

interface Activity {
  id: number;
  activityType: string; 
  details: string;
  recordedByEmail: string;
}

interface LeadStatusHistory {
  id: number;
  oldStatus: string;
  newStatus: string;
  changeByEmail: string; 
  changedAt: string; 
}

interface Props {
  token: string;
  onLogout: () => void;
}

const STATUS_GRADIENT: Record<string, string> = {
  NEW:         'linear-gradient(135deg,#06b6d4,#3b82f6)',
  IN_PROGRESS: 'linear-gradient(135deg,#eab308,#ca8a04)',
  CONTACTED:   'linear-gradient(135deg,#f59e0b,#ef4444)',
  QUALIFIED:   'linear-gradient(135deg,#10b981,#059669)',
  LOST:        'linear-gradient(135deg,#ef4444,#ec4899)',
};

const STATUS_BADGE_STYLE: Record<string, React.CSSProperties> = {
  NEW:         { background:'rgba(6,182,212,0.15)',  color:'#67e8f9', border:'1px solid rgba(6,182,212,0.3)'  },
  IN_PROGRESS: { background:'rgba(234,179,8,0.15)',  color:'#fef08a', border:'1px solid rgba(234,179,8,0.3)'   },
  CONTACTED:   { background:'rgba(245,158,11,0.15)', color:'#fcd34d', border:'1px solid rgba(245,158,11,0.3)' },
  QUALIFIED:   { background:'rgba(16,185,129,0.15)', color:'#6ee7b7', border:'1px solid rgba(16,185,129,0.3)' },
  LOST:        { background:'rgba(239,68,68,0.15)',  color:'#fca5a5', border:'1px solid rgba(239,68,68,0.3)'   },
};

const AVATAR_COLORS = [
  { bg:'rgba(139,92,246,0.28)',  color:'#c4b5fd' },
  { bg:'rgba(6,182,212,0.28)',   color:'#67e8f9' },
  { bg:'rgba(217,70,239,0.28)',  color:'#f0abfc' },
  { bg:'rgba(16,185,129,0.28)',  color:'#6ee7b7' },
  { bg:'rgba(245,158,11,0.28)',  color:'#fcd34d' },
];

function getInitials(name: string) {
  if (!name) return "?";
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const LeadDashboard: React.FC<Props> = ({ token, onLogout }) => {
  const [leads, setLeads]               = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities]     = useState<Activity[]>([]);
  const [statusHistory, setStatusHistory] = useState<LeadStatusHistory[]>([]);
  
  const [name,  setName]                = useState('');
  const [email, setEmail]               = useState('');
  const [phone, setPhone]               = useState('');
  const [activityType, setActivityType] = useState<'CALL'|'EMAIL'|'MEETING'>('CALL');
  const [details, setDetails]           = useState('');
  const [agentEmail, setAgentEmail]     = useState('sales.agent@crm.com');

  // PAGINATION, FILTER & SORT STATES
  const [page, setPage]                 = useState(0); 
  const [size, setSize]                 = useState(10); 
  const [totalPages, setTotalPages]     = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy]             = useState('createdAt'); 
  const [sortDir, setSortDir]           = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery]   = useState('');

  const [dbStats, setDbStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalActivities: 0,
    leadBYStatus: []
  });

  const LEADS_API = 'http://localhost:8080/leads'; 
  const headers = { Authorization: `Bearer ${token}` };

  const fetchDashboardStats = async () => {
    try {
      const data = await getDashboardStats(headers);
      if (data) setDbStats(data);
    } catch (error) {
      console.error("Dashboard stats fetch karne me error aayi:", error);
    }
  };

  const fetchLeads = async () => { 
    try {
      const data = await getDashboardLeads(page, size, sortBy, sortDir, statusFilter, searchQuery, headers);
      setLeads(data.content || []); 
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error: any) {
      handleApiError(error);
    }
  };
  
  const fetchActivities = async (id: number) => { 
     try {
       const r = await axios.get(`${LEADS_API}/${id}/activities`, { headers }); 
       setActivities(Array.isArray(r.data) ? r.data : []);
     } catch(e) { 
       console.error("Error fetching activities:", e); 
     }
  };

  const fetchStatusHistory = async (id: number) => {
    try {
      const r = await axios.get(`${LEADS_API}/${id}/history`, { headers }); 
      setStatusHistory(Array.isArray(r.data) ? r.data : []);
    } catch(e) { 
      console.error("Error fetching status history:", e); 
    }
  };

  const handleApiError = (error: any) => {
    if (error.response && error.response.data && error.response.data.message) {
      alert(`Error: ${error.response.data.message}`); 
    } else {
      alert("Something went wrong with the server.");
    }
  };

  useEffect(() => { 
    fetchLeads(); 
    fetchDashboardStats();
  }, [page, sortBy, sortDir, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0); 
    fetchLeads();
  };

  const handleSelectLead = (lead: Lead) => { 
    setSelectedLead(lead); 
    fetchActivities(lead.id); 
    fetchStatusHistory(lead.id); 
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(LEADS_API, { name, email, phone, status: 'NEW' }, { headers });
      setName(''); setEmail(''); setPhone('');
      setPage(0); 
      fetchLeads();
      fetchDashboardStats();
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      await axios.patch(`${LEADS_API}/${leadId}/status?status=${newStatus}`, null, { headers });
      
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({
          ...selectedLead,
          status: newStatus as any
        });
      }
      fetchLeads(); 
      fetchStatusHistory(leadId); 
      fetchDashboardStats();
    } catch (error: any) {
      handleApiError(error); 
    }
  };

  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    try {
      await axios.post(`${LEADS_API}/${selectedLead.id}/activities`, { activityType, details, recordedByEmail: agentEmail }, { headers });
      setDetails('');
      fetchActivities(selectedLead.id);
      fetchDashboardStats();
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const handleSortToggle = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const getStatusCount = (statusName: string) => {
    if (!dbStats.leadBYStatus) return 0;
    const found = dbStats.leadBYStatus.find(item => item.status === statusName);
    return found ? found.count : 0;
  };

  const stats = [
    { label: 'Total Leads (DB)',     value: dbStats.totalLeads,        sub: 'Total database entries' },
    { label: 'New Queue',            value: getStatusCount('NEW'),      sub: 'Entries with NEW status' },
    { label: 'Qualified Leads',      value: getStatusCount('QUALIFIED'),sub: 'All converted pipelines' },
    { label: 'Total Activities',     value: dbStats.totalActivities,    sub: 'Total cumulative logs' },
  ];

  const panelStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(40px) saturate(1.5)',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const statCardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.07)',
    backdropFilter: 'blur(36px)',
    borderRadius: 16,
    padding: '12px 16px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px 10px 36px',
    borderRadius: 14,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    color: '#fff',
    fontSize: 13,
    outline: 'none',
  };

  const addBtnStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px',
    borderRadius: 14,
    background: 'linear-gradient(135deg,#d946ef,#8b5cf6,#6d28d9)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={{ height:'100vh', padding: '20px', display:'flex', flexDirection:'column', color:'#fff', background: '#0f172a', overflow: 'hidden' }}>

      {/* ── HEADER ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContnet:'space-between', marginBottom:16, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:14, background:'linear-gradient(135deg,#d946ef,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>⚡</div>
          <div>
            <div style={{ fontSize:26, fontWeight:800, lineHeight:1, background:'linear-gradient(to right,#c4b5fd,#67e8f9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>leadflux</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:2 }}>Manage leads &amp; activities</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ padding:'9px 18px', borderRadius:14, background:'rgba(239,68,68,0.18)', border:'1px solid rgba(239,68,68,0.28)', color:'#fca5a5', fontSize:12, fontWeight:600, cursor:'pointer', marginLeft: 'auto' }}>⊕ Logout</button>
      </div>

      {/* ── STATS ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:12, flexShrink:0 }}>
        {stats.map((s, i) => (
          <div key={i} style={statCardStyle}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.3px', color: 'rgba(255,255,255,0.32)' }}>{s.label}</div>
            <div style={{ fontSize:42, fontWeight:800, lineHeight:1.05, marginTop:2 }}>{s.value}</div>
            {s.sub && <div style={{ fontSize:9, color:'rgba(255,255,255,0.20)', marginTop:4 }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* SEARCH & FILTER ROW */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexShrink: 0 }}>
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
          <input 
            type="text" 
            placeholder="Search leads by client name or email string..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 38 }}
          />
        </form>
        <div style={{ position: 'relative', width: 200 }}>
          <Filter size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
          <select 
            value={statusFilter} 
            onChange={e => { setPage(0); setStatusFilter(e.target.value); }}
            style={{ ...inputStyle, paddingLeft: 34, cursor: 'pointer', appearance: 'none' }}
          >
            <option value="" style={{ background: '#1e293b' }}>All System Statuses</option>
            <option value="NEW" style={{ background: '#1e293b' }}>NEW</option>
            <option value="IN_PROGRESS" style={{ background: '#1e293b' }}>IN_PROGRESS</option>
            <option value="CONTACTED" style={{ background: '#1e293b' }}>CONTACTED</option>
            <option value="QUALIFIED" style={{ background: '#1e293b' }}>QUALIFIED</option>
            <option value="LOST" style={{ background: '#1e293b' }}>LOST</option>
          </select>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:10, flex:1, minHeight:0 }}>

        {/* ── LEFT PANEL ── */}
        <div style={panelStyle}>
          <div style={{ padding:'14px 14px 12px', borderBottom:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
            <form onSubmit={handleAddLead} style={{ display:'flex', flexDirection:'column' }}>
              <div style={{ position: 'relative', marginBottom: 8 }}>
                <User size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
              </div>
              <div style={{ position: 'relative', marginBottom: 8 }}>
                <Mail size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
              </div>
              <div style={{ position: 'relative', marginBottom: 10 }}>
                <Phone size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                <input type="text" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} required style={inputStyle} />
              </div>
              <button type="submit" style={addBtnStyle}>+ Add Lead</button>
            </form>
          </div>

          <div style={{ display: 'flex', padding: '10px 14px 4px', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>
            <span onClick={() => handleSortToggle('name')} style={{ cursor: 'pointer' }}>CLIENT NAME {sortBy === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</span>
            <span onClick={() => handleSortToggle('status')} style={{ cursor: 'pointer' }}>PIPELINE STATUS {sortBy === 'status' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</span>
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:'4px 12px 12px' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {leads.map((lead, idx) => {
                const av = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                const active = selectedLead?.id === lead.id;
                return (
                  <div key={lead.id} onClick={() => handleSelectLead(lead)}
                    style={{
                      display:'flex', alignItems:'center', gap:10, padding:'9px 11px', borderRadius:14, cursor:'pointer', transition:'all 0.2s',
                      background: active ? 'rgba(124,58,237,0.22)' : 'rgba(255,255,255,0.03)',
                      border: active ? '1px solid rgba(124,58,237,0.38)' : '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div style={{ width:34, height:34, borderRadius:'50%', flexShrink:0, background:av.bg, color:av.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>{getInitials(lead.name)}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lead.name}</div>
                      <div style={{ fontSize:10, color:'rgba(103,232,249,0.7)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Agent: {lead.assignedToAgentName || 'Unassigned Queue'}</div>
                    </div>
                    <span style={{ fontSize:8, fontWeight:700, padding:'2px 8px', borderRadius:999, flexShrink:0, ...STATUS_BADGE_STYLE[lead.status] }}>{lead.status}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.15)', flexShrink: 0 }}>
            <button disabled={page === 0} onClick={() => setPage(prev => Math.max(0, prev - 1))}
              style={{ background: page === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '5px 8px', cursor: page === 0 ? 'not-allowed' : 'pointer', color: page === 0 ? 'rgba(255,255,255,0.2)' : '#fff', display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Page {page + 1} of {Math.max(1, totalPages)}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(prev => prev + 1)}
              style={{ background: page >= totalPages - 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '5px 8px', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', color: page >= totalPages - 1 ? 'rgba(255,255,255,0.2)' : '#fff', display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ ...panelStyle, position:'relative', overflow:'hidden' }}>
          {!selectedLead ? (
            <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10 }}>
              <div style={{ fontSize:50 }}>✨</div>
              <div style={{ fontSize:20, fontWeight:700, color:'rgba(255,255,255,0.65)' }}>Select a Lead Pipeline</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.30)' }}>Click any user profile item card to display logs mapping streams</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', height:'100%', position:'relative', zIndex:1 }}>
              
              <div style={{ padding:'16px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  {(() => {
                    const idx = leads.findIndex(l => l.id === selectedLead.id);
                    const av  = AVATAR_COLORS[idx !== -1 ? idx % AVATAR_COLORS.length : 0];
                    return (
                      <div style={{ width:48, height:48, borderRadius:'50%', background:av.bg, color:av.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700 }}>
                        {getInitials(selectedLead.name)}
                      </div>
                    );
                  })()}
                  <div>
                    <div style={{ fontSize:20, fontWeight:800, color:'#fff' }}>{selectedLead.name}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.38)', marginTop:2 }}>{selectedLead.email} | {selectedLead.phone}</div>
                  </div>
                </div>
                
                <select value={selectedLead.status} onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                  style={{ padding:'6px 16px', borderRadius: 999, background: STATUS_GRADIENT[selectedLead.status] || '#555', fontSize:12, fontWeight:700, color:'#fff', border: 'none', outline: 'none', cursor: 'pointer' }}>
                  <option value="NEW" style={{background: '#1e293b'}}>NEW</option>
                  <option value="IN_PROGRESS" style={{background: '#1e293b'}}>IN_PROGRESS</option>
                  <option value="CONTACTED" style={{background: '#1e293b'}}>CONTACTED</option>
                  <option value="QUALIFIED" style={{background: '#1e293b'}}>QUALIFIED</option>
                  <option value="LOST" style={{background: '#1e293b'}}>LOST</option>
                </select>
              </div>

              <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
                <form onSubmit={handleLogActivity} style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    <select value={activityType} onChange={e => setActivityType(e.target.value as any)} style={{ ...inputStyle, paddingLeft:12, cursor:'pointer' }}>
                      <option value="CALL" style={{ background: '#1e293b' }}>CALL LOG</option>
                      <option value="EMAIL" style={{ background: '#1e293b' }}>EMAIL BROADCAST</option>
                      <option value="MEETING" style={{ background: '#1e293b' }}>MEETING EVENT</option>
                    </select>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                      <input type="email" value={agentEmail} onChange={e => setAgentEmail(e.target.value)} style={{ ...inputStyle, marginBottom:0 }} />
                    </div>
                  </div>
                  <div style={{ position:'relative' }}>
                    <FileText size={15} style={{ position: 'absolute', left: 11, top: 14, opacity: 0.4 }} />
                    <textarea rows={2} value={details} onChange={e => setDetails(e.target.value)} placeholder="Type what you discussed with client..." required style={{ ...inputStyle, paddingTop:10, paddingBottom:10, resize:'none', height:'auto', paddingLeft: 36 }} />
                  </div>
                  <button type="submit" style={{ ...addBtnStyle, marginTop:4 }}>Save Activity</button>
                </form>
              </div>

              <div style={{ flex:1, overflowY:'auto', padding:'14px 18px' }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.3px', color: 'rgba(255,255,255,0.32)', marginBottom: 10 }}>🕐 Activity Timeline Feed</div>
                {activities.length === 0 ? (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:50, marginBottom:15 }}><div style={{ fontSize:12, color:'rgba(255,255,255,0.30)' }}>No activities logged yet for this client.</div></div>
                ) : (
                  activities.map(a => (
                    <div key={a.id} style={{ padding:'12px 14px', borderRadius:14, marginBottom:8, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:7 }}>
                        <span style={{ fontSize:9, fontWeight:700, padding:'3px 10px', borderRadius: 999, background: 'rgba(139,92,246,0.15)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.25)' }}>{a.activityType}</span>
                        <span style={{ fontSize:10, color:'rgba(255,255,255,0.30)' }}>{a.recordedByEmail}</span>
                      </div>
                      <div style={{ fontSize:12, color:'rgba(255,255,255,0.75)', lineHeight:1.5 }}>{a.details}</div>
                    </div>
                  ))
                )}

                <hr style={{ border: '0', borderTop: '1px dashed rgba(255,255,255,0.08)', margin: '15px 0' }} />

                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.3px', color: 'rgba(255,255,255,0.32)', marginBottom: 10 }}>🛡️ Status Transition Trail</div>
                {statusHistory.length === 0 ? (
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)', textAlign:'center', padding:'10px' }}>No lifecycle transition trails recorded.</div>
                ) : (
                  statusHistory.map(h => (
                    <div key={h.id} style={{ padding:'10px 12px', borderRadius:12, marginBottom:6, background:'rgba(6,182,212,0.03)', border:'1px solid rgba(6,182,212,0.1)' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontSize:11, fontWeight:600, color:'#67e8f9' }}>{h.oldStatus || 'INIT_ENTRY'} ➜ {h.newStatus}</span>
                        <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>User: {h.changeByEmail}</span>
                      </div>
                      <div style={{ fontSize:9, color:'rgba(255,255,255,0.4)', textAlign: 'right' }}>{new Date(h.changedAt).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDashboard;