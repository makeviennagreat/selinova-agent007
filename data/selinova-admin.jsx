import { useState } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────
const G = {
  bg: '#030305', panel: '#0a0a0e', card: '#111117',
  border: 'rgba(255,255,255,0.07)', borderHov: 'rgba(255,255,255,0.14)',
  accent: '#00e676', gold: '#d4932a', red: '#ff4f4f',
  amber: '#ffca28', blue: '#4d9fff', text: '#f0f0f0',
  muted: '#777', dim: '#444',
};
const card  = { background: G.card, border: `1px solid ${G.border}`, borderRadius: 12 };
const btn   = { border: `1px solid ${G.border}`, borderRadius: 8, padding: '8px 14px', cursor: 'pointer', background: 'transparent', color: G.text, fontSize: 13, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 };
const inp   = { background: '#0d0d12', border: `1px solid ${G.border}`, borderRadius: 8, padding: '9px 12px', color: G.text, fontSize: 13, width: '100%', outline: 'none', fontFamily: 'inherit' };

// ─── SAMPLE DATA ──────────────────────────────────────────────
const calc = l => {
  let s = 0;
  if (l.company?.trim())   s += 15;
  if (l.contact?.trim())   s += 10;
  if (l.phone?.trim())     s += 15;
  if (l.email?.trim())     s += 15;
  if (l.website?.trim())   s += 20;
  if (l.address?.trim())   s += 10;
  if (l.industry?.trim())  s += 5;
  if (l.employees > 0)     s += 5;
  if (l.revenue?.trim())   s += 5;
  return s;
};

const RAW = [
  { id:'L001', company:'Müller Bäckerei GmbH',        contact:'Hans Müller',    phone:'+49 89 123456',  email:'info@mueller-baeckerei.de', website:'mueller-baeckerei.de',    address:'München',  industry:'Gastronomie',   employees:12, revenue:'480k',  websiteMatch:true  },
  { id:'L002', company:'Schmidt & Partner',            contact:'Klaus Schmidt',  phone:'+49 30 987654',  email:'',                          website:'',                        address:'Berlin',   industry:'Beratung',      employees:0,  revenue:'',      websiteMatch:false },
  { id:'L003', company:'TechVision Solutions',         contact:'Maria Bauer',    phone:'+49 40 555123',  email:'maria@techvision.de',       website:'techvision-solutions.de', address:'Hamburg',  industry:'IT',            employees:45, revenue:'2.1M',  websiteMatch:true  },
  { id:'L004', company:'Autohaus Brandl',              contact:'',               phone:'+49 821 9876',   email:'',                          website:'auto-premiums.com',       address:'Augsburg', industry:'Automotive',    employees:0,  revenue:'',      websiteMatch:false },
  { id:'L005', company:'Yoga Karma Studio',            contact:'Priya Sharma',   phone:'+49 69 441234',  email:'priya@karma-yoga.de',       website:'wellness-oasis.de',       address:'Frankfurt',industry:'Wellness',      employees:3,  revenue:'150k',  websiteMatch:false },
  { id:'L006', company:'Steinberg Immobilien GmbH',   contact:'Rolf Steinberg', phone:'+49 711 334455', email:'rolf@steinberg-immo.de',    website:'steinberg-immo.de',       address:'Stuttgart',industry:'Immobilien',    employees:8,  revenue:'1.2M',  websiteMatch:true  },
  { id:'L007', company:'Café Sonnenschein',            contact:'',               phone:'',               email:'',                          website:'',                        address:'Köln',     industry:'Gastronomie',   employees:0,  revenue:'',      websiteMatch:false },
  { id:'L008', company:'Digital Pulse Agency',        contact:'Tom Richter',    phone:'+49 89 667788',  email:'tom@digitalpulse.de',       website:'digitalpulse.de',         address:'München',  industry:'Marketing',     employees:22, revenue:'800k',  websiteMatch:true  },
  { id:'L009', company:'Fleischerei Wagner',           contact:'Bernd Wagner',   phone:'+49 621 234567', email:'wagner@fleischerei.de',     website:'',                        address:'Mannheim', industry:'Gastronomie',   employees:5,  revenue:'320k',  websiteMatch:false },
  { id:'L010', company:'IT-Consulting Nord',           contact:'Sandra Beck',    phone:'+49 451 112233', email:'beck@itconsulting-nord.de', website:'itconsulting-nord.de',    address:'Lübeck',   industry:'IT',            employees:15, revenue:'750k',  websiteMatch:true  },
  { id:'L011', company:'Blumen Paradies',              contact:'',               phone:'+49 231 998877', email:'',                          website:'blumen-shop.de',          address:'Dortmund', industry:'Einzelhandel',  employees:2,  revenue:'',      websiteMatch:false },
  { id:'L012', company:'Gebäudereinigung Sauber GmbH',contact:'Frank Sauber',   phone:'+49 201 445566', email:'info@sauber-clean.de',      website:'sauber-clean.de',         address:'Essen',    industry:'Dienstleistung',employees:30, revenue:'1.1M',  websiteMatch:true  },
];

const INIT_LEADS  = RAW.map(l => ({ ...l, completeness: calc(l), status:'new', pool:null, agent:null }));
const INIT_AGENTS = [
  { id:'A01', name:'Anna Weber',      initials:'AW', status:'active',  pools:[], leads:[], calls:47, conversions:12, callNotes:[] },
  { id:'A02', name:'Marcus Klein',    initials:'MK', status:'active',  pools:[], leads:[], calls:31, conversions:8,  callNotes:[] },
  { id:'A03', name:'Sarah Hoffmann',  initials:'SH', status:'pause',   pools:[], leads:[], calls:58, conversions:19, callNotes:[] },
  { id:'A04', name:'Jonas Becker',    initials:'JB', status:'active',  pools:[], leads:[], calls:23, conversions:5,  callNotes:[] },
  { id:'A05', name:'Lena Fischer',    initials:'LF', status:'offline', pools:[], leads:[], calls:15, conversions:3,  callNotes:[] },
];
const POOL_COLS = ['#00e676','#ff4f4f','#ffca28','#4d9fff','#ab47bc','#ff7043'];
const INIT_POOLS = [
  { id:'P01', name:'Premium Leads',  color:'#00e676', description:'Vollständige Stammdaten, passende Webseite',          criteria:'green',  agents:[], leads:[] },
  { id:'P02', name:'Qualifiziert',   color:'#ffca28', description:'Ausreichende Daten, Webseite vorhanden',              criteria:'yellow', agents:[], leads:[] },
  { id:'P03', name:'Roter Bereich',  color:'#ff4f4f', description:'Wenig Stammdaten, kein/unpassender Web-Auftritt',     criteria:'red',    agents:[], leads:[] },
];

const STATUS_LBL = { new:'Neu', assigned:'Zugewiesen', contacted:'Kontaktiert', closed:'Abgeschlossen' };
const STATUS_CLR = { new:G.blue, assigned:'#d4932a', contacted:G.accent, closed:G.red };
const AGENT_CLR  = { active:G.accent, pause:G.amber, offline:'#555' };

async function claude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({
      model:'claude-sonnet-4-20250514', max_tokens:1000,
      system:'Du bist ein CRM-KI-Assistent für ein deutsches Vertriebsteam. Antworte immer auf Deutsch.',
      messages:[{ role:'user', content:prompt }],
    }),
  });
  const d = await res.json();
  return d.content?.[0]?.text || '';
}

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function SelinovaAdmin() {
  const [leads,   setLeads]   = useState(INIT_LEADS);
  const [agents,  setAgents]  = useState(INIT_AGENTS);
  const [pools,   setPools]   = useState(INIT_POOLS);
  const [tab,     setTab]     = useState('leads');

  // Lead selection
  const [sel,     setSel]     = useState(new Set());

  // Assign modal
  const [showAssign,  setShowAssign]  = useState(false);
  const [assignTo,    setAssignTo]    = useState([]);

  // Pool creation
  const [showCP,  setShowCP]  = useState(false);
  const [newPool, setNewPool] = useState({ name:'', color:POOL_COLS[0], description:'' });

  // Drag & drop
  const [dragAgent,  setDragAgent]  = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  // AI loading
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLog,     setAiLog]     = useState([]);

  // Call note (per agent – panel open state lives here)
  const [noteAgent,   setNoteAgent]   = useState(null);
  const [noteText,    setNoteText]    = useState('');
  const [noteOutcome, setNoteOutcome] = useState('interested');
  const [noteResult,  setNoteResult]  = useState(null);
  const [noteLoad,    setNoteLoad]    = useState(false);

  // Filters
  const [search,  setSearch]  = useState('');
  const [fStatus, setFStatus] = useState('all');
  const [fPool,   setFPool]   = useState('all');

  // ─── Derived ────────────────────────────────────
  const filtered = leads.filter(l => {
    const ms  = !search || l.company.toLowerCase().includes(search.toLowerCase()) || l.contact?.toLowerCase().includes(search.toLowerCase());
    const mst = fStatus === 'all' || l.status === fStatus;
    const mp  = fPool === 'all' || (fPool === 'none' ? !l.pool : l.pool === fPool);
    return ms && mst && mp;
  });

  const getAgent = id => agents.find(a => a.id === id);
  const getPool  = id => pools.find(p => p.id === id);
  const compColor = c => c >= 70 ? G.accent : c >= 40 ? G.amber : G.red;

  // ─── Lead selection ─────────────────────────────
  const toggleLead = id => setSel(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll  = ()  => {
    const ids = filtered.map(l => l.id);
    setSel(sel.size === ids.length ? new Set() : new Set(ids));
  };

  // ─── Assign leads ───────────────────────────────
  const doAssign = () => {
    const ids = [...sel];
    setLeads(prev => prev.map(l => {
      if (!sel.has(l.id)) return l;
      const ai = ids.indexOf(l.id) % assignTo.length;
      return { ...l, agent: assignTo[ai], status:'assigned' };
    }));
    setAgents(prev => prev.map(a => {
      if (!assignTo.includes(a.id)) return a;
      const my = ids.filter((_, i) => i % assignTo.length === assignTo.indexOf(a.id));
      return { ...a, leads:[...new Set([...a.leads, ...my])] };
    }));
    setSel(new Set()); setShowAssign(false); setAssignTo([]);
  };

  // ─── Pool create ────────────────────────────────
  const doCreate = () => {
    if (!newPool.name.trim()) return;
    setPools(p => [...p, { id:`P${Date.now()}`, ...newPool, criteria:'custom', agents:[], leads:[] }]);
    setShowCP(false); setNewPool({ name:'', color:POOL_COLS[0], description:'' });
  };

  // ─── Drag & drop ────────────────────────────────
  const onDragStart = (e, id) => { setDragAgent(id); e.dataTransfer.effectAllowed = 'copy'; };
  const onDrop      = (e, pid) => {
    e.preventDefault();
    if (!dragAgent) return;
    setPools(prev => prev.map(p => p.id !== pid || p.agents.includes(dragAgent) ? p : { ...p, agents:[...p.agents, dragAgent] }));
    setAgents(prev => prev.map(a => a.id !== dragAgent || a.pools.includes(pid) ? a : { ...a, pools:[...a.pools, pid] }));
    setDragAgent(null); setDropTarget(null);
  };
  const removeFromPool = (agId, pid) => {
    setPools(prev => prev.map(p => p.id === pid ? { ...p, agents:p.agents.filter(a => a !== agId) } : p));
    setAgents(prev => prev.map(a => a.id === agId ? { ...a, pools:a.pools.filter(p => p !== pid) } : a));
  };
  const addAgentToPool = (agId, pid) => {
    if (!agId || !pid) return;
    setPools(prev => prev.map(p => p.id !== pid || p.agents.includes(agId) ? p : { ...p, agents:[...p.agents, agId] }));
    setAgents(prev => prev.map(a => a.id !== agId || a.pools.includes(pid) ? a : { ...a, pools:[...a.pools, pid] }));
  };

  // ─── AI Pool categorization ─────────────────────
  const aiCategorize = async () => {
    setAiLoading(true); setAiLog([]);
    const unassigned = leads.filter(l => !l.pool);
    const leadsStr = unassigned.map(l =>
      `ID:${l.id} Firma:"${l.company}" Kontakt:"${l.contact||'–'}" Tel:"${l.phone||'–'}" Email:"${l.email||'–'}" Web:"${l.website||'–'}" Branche:"${l.industry}" MA:${l.employees||0} Umsatz:"${l.revenue||'–'}" WebPasst:${l.websiteMatch} Vollst:${l.completeness}%`
    ).join('\n');
    const poolStr = pools.map(p => `ID:${p.id} Name:"${p.name}" Kriterium:${p.criteria} Info:"${p.description}"`).join('\n');

    const prompt = `Analysiere diese Leads und ordne sie den passenden Pools zu.

POOLS:
${poolStr}

LEADS:
${leadsStr}

Regeln:
- green/Premium: Vollständigkeit >=70%, Webseite vorhanden UND passt zum Firmennamen
- yellow/Qualifiziert: Vollständigkeit 40–70% ODER Webseite existiert aber passt nicht gut
- red/Roter Bereich: Vollständigkeit <40%, keine Webseite, oder Webseite klar unpassend

Antworte NUR als gültiges JSON-Array, KEIN Markdown:
[{"leadId":"L001","poolId":"P01","reason":"Kurze Begründung"}]`;

    try {
      const raw = await claude(prompt);
      const clean = raw.replace(/```json?|```/g,'').trim();
      const assignments = JSON.parse(clean);
      setLeads(prev => prev.map(l => {
        const a = assignments.find(x => x.leadId === l.id);
        return a ? { ...l, pool:a.poolId } : l;
      }));
      setPools(prev => prev.map(p => {
        const assigned = assignments.filter(a => a.poolId === p.id).map(a => a.leadId);
        return { ...p, leads:[...new Set([...p.leads, ...assigned])] };
      }));
      setAiLog(assignments.map(a => {
        const lead = unassigned.find(l => l.id === a.leadId);
        const pool = pools.find(p => p.id === a.poolId);
        return { company:lead?.company||a.leadId, pool:pool?.name||a.poolId, color:pool?.color||G.accent, reason:a.reason };
      }));
    } catch(e) {
      setAiLog([{ company:'Fehler', pool:'Analyse fehlgeschlagen', color:G.red, reason:String(e) }]);
    }
    setAiLoading(false);
  };

  // ─── Call note AI analysis ──────────────────────
  const analyzeNote = async () => {
    if (!noteText.trim()) return;
    setNoteLoad(true); setNoteResult(null);
    const agent = getAgent(noteAgent);
    const prompt = `Analysiere diese Anrufnotiz und erstelle eine strukturierte CRM-Auswertung auf Deutsch.

Agent: ${agent?.name}
Ergebnis: ${noteOutcome}
Notiz: "${noteText}"

Antworte EXAKT als JSON (KEIN Markdown, keine Backticks):
{
  "zusammenfassung": "2-3 Sätze",
  "sentiment": "positiv|neutral|negativ",
  "prioritaet": "hoch|mittel|niedrig",
  "naechsteSchritte": ["Schritt 1","Schritt 2","Schritt 3"],
  "roadmap": [
    {"phase":"Phase 1","aktion":"Was zu tun","zeitrahmen":"Wann"},
    {"phase":"Phase 2","aktion":"Was zu tun","zeitrahmen":"Wann"},
    {"phase":"Phase 3","aktion":"Was zu tun","zeitrahmen":"Wann"}
  ],
  "tags": ["tag1","tag2","tag3"]
}`;

    try {
      const raw = await claude(prompt);
      const clean = raw.replace(/```json?|```/g,'').trim();
      const parsed = JSON.parse(clean);
      setNoteResult(parsed);
      setAgents(prev => prev.map(a => a.id !== noteAgent ? a : {
        ...a,
        callNotes:[...a.callNotes, { id:Date.now(), text:noteText, outcome:noteOutcome, analysis:parsed, ts:new Date().toLocaleString('de-DE') }]
      }));
    } catch(e) {
      setNoteResult({ error:true, msg:'Analyse fehlgeschlagen – bitte erneut versuchen.' });
    }
    setNoteLoad(false);
  };

  // ─────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────
  return (
    <div style={{ background:G.bg, minHeight:'100vh', color:G.text, fontFamily:"'Inter',system-ui,sans-serif", fontSize:14 }}>

      {/* ── HEADER ── */}
      <div style={{ background:G.panel, borderBottom:`1px solid ${G.border}`, padding:'0 24px', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:58 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:34, height:34, background:G.accent, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16, color:'#000', letterSpacing:-1 }}>S</div>
            <div>
              <div style={{ fontWeight:800, fontSize:15, letterSpacing:2, textTransform:'uppercase' }}>SELINOVA <span style={{ color:G.accent }}>ADMIN</span></div>
              <div style={{ fontSize:10, color:G.muted, letterSpacing:1 }}>LEAD MANAGEMENT SYSTEM</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:20, fontSize:12, color:G.dim }}>
            <span style={{ color:G.accent }}>● {agents.filter(a=>a.status==='active').length} aktiv</span>
            <span>{leads.length} Leads</span>
            <span>{pools.length} Pools</span>
          </div>
        </div>
        {/* TABS */}
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex' }}>
          {[{id:'leads',label:'Leads',count:leads.length,icon:'⚡'},{id:'agents',label:'Agenten',count:agents.length,icon:'👤'},{id:'pools',label:'Pools',count:pools.length,icon:'🎯'}].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background:'none', border:'none', borderBottom:`2px solid ${tab===t.id?G.accent:'transparent'}`, padding:'12px 20px', color:tab===t.id?G.accent:G.muted, cursor:'pointer', fontWeight:600, fontSize:13, display:'flex', alignItems:'center', gap:7, whiteSpace:'nowrap', transition:'all 0.2s', fontFamily:'inherit' }}>
              {t.icon} {t.label}
              <span style={{ background:tab===t.id?`${G.accent}20`:'#16161e', color:tab===t.id?G.accent:G.dim, fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:99 }}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'24px' }}>

        {/* ══════════════════ LEADS TAB ══════════════════ */}
        {tab==='leads' && (
          <div>
            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
              {[
                { label:'Gesamt',           val:leads.length,                               c:G.text  },
                { label:'Zugewiesen',       val:leads.filter(l=>l.agent).length,            c:G.gold  },
                { label:'In Pool',          val:leads.filter(l=>l.pool).length,             c:G.accent},
                { label:'Schwach (<40%)',   val:leads.filter(l=>l.completeness<40).length,  c:G.red   },
              ].map(s => (
                <div key={s.label} style={{ ...card, padding:'14px 16px' }}>
                  <div style={{ fontWeight:800, fontSize:26, color:s.c, fontFamily:'monospace', lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:11, color:G.dim, marginTop:5, textTransform:'uppercase', letterSpacing:0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div style={{ display:'flex', gap:10, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Suche Firma oder Kontakt..." style={{ ...inp, maxWidth:250 }} />
              <select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={{ ...inp, width:'auto', cursor:'pointer' }}>
                <option value="all">Alle Status</option>
                <option value="new">Neu</option>
                <option value="assigned">Zugewiesen</option>
                <option value="contacted">Kontaktiert</option>
                <option value="closed">Abgeschlossen</option>
              </select>
              <select value={fPool} onChange={e=>setFPool(e.target.value)} style={{ ...inp, width:'auto', cursor:'pointer' }}>
                <option value="all">Alle Pools</option>
                <option value="none">Ohne Pool</option>
                {pools.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <div style={{ flex:1 }} />
              {sel.size>0 && (
                <button onClick={()=>setShowAssign(true)} style={{ ...btn, background:G.accent, color:'#000', fontWeight:700, border:'none', padding:'9px 18px', animation:'pulse 1.5s infinite' }}>
                  ✦ {sel.size} Lead{sel.size>1?'s':''} zuweisen
                </button>
              )}
            </div>

            {/* Table */}
            <div style={{ ...card, overflow:'hidden' }}>
              <div style={{ display:'grid', gridTemplateColumns:'40px minmax(0,2fr) 120px 90px 120px 100px', gap:8, padding:'10px 16px', borderBottom:`1px solid ${G.border}`, fontSize:11, color:G.dim, textTransform:'uppercase', letterSpacing:0.7, fontWeight:600, background:'#0d0d12' }}>
                <div style={{ display:'flex', alignItems:'center' }}>
                  <input type="checkbox" checked={sel.size>0&&sel.size===filtered.length} onChange={toggleAll} style={{ cursor:'pointer', accentColor:G.accent, width:14, height:14 }} />
                </div>
                <div>Firma / Kontakt</div><div>Pool</div><div>Stammdaten</div><div>Agent</div><div>Status</div>
              </div>

              {filtered.length===0 && <div style={{ padding:'40px', textAlign:'center', color:G.dim }}>Keine Leads gefunden</div>}

              {filtered.map(lead => {
                const agent = getAgent(lead.agent);
                const pool  = getPool(lead.pool);
                const isS   = sel.has(lead.id);
                return (
                  <div key={lead.id} onClick={()=>toggleLead(lead.id)}
                    style={{ display:'grid', gridTemplateColumns:'40px minmax(0,2fr) 120px 90px 120px 100px', gap:8, padding:'11px 16px', borderBottom:`1px solid ${G.border}`, cursor:'pointer', background:isS?'rgba(0,230,118,0.04)':'transparent', alignItems:'center' }}>
                    <div onClick={e=>{e.stopPropagation();toggleLead(lead.id);}}>
                      <input type="checkbox" readOnly checked={isS} style={{ cursor:'pointer', accentColor:G.accent, width:14, height:14 }} />
                    </div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontWeight:600, fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lead.company}</div>
                      <div style={{ fontSize:11, color:G.muted, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lead.contact||'—'} · {lead.phone||'—'}</div>
                      {lead.website && <div style={{ fontSize:10, color:lead.websiteMatch?G.accent:G.amber, marginTop:2 }}>🌐 {lead.website} {lead.websiteMatch?'✓ passt':'⚠ unpassend'}</div>}
                    </div>
                    <div>
                      {pool
                        ? <span style={{ fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:99, background:`${pool.color}18`, color:pool.color, border:`1px solid ${pool.color}40`, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{pool.name}</span>
                        : <span style={{ color:G.dim, fontSize:12 }}>—</span>}
                    </div>
                    <div>
                      <div style={{ height:3, background:'#1a1a22', borderRadius:3, overflow:'hidden', marginBottom:4 }}>
                        <div style={{ height:'100%', width:`${lead.completeness}%`, background:compColor(lead.completeness), borderRadius:3 }} />
                      </div>
                      <div style={{ fontSize:11, color:compColor(lead.completeness), fontFamily:'monospace' }}>{lead.completeness}%</div>
                    </div>
                    <div>
                      {agent
                        ? <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                            <div style={{ width:22, height:22, borderRadius:'50%', background:`${G.accent}18`, color:G.accent, fontSize:8, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{agent.initials}</div>
                            <span style={{ fontSize:11, color:'#aaa', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{agent.name.split(' ')[0]}</span>
                          </div>
                        : <span style={{ color:G.dim, fontSize:12 }}>—</span>}
                    </div>
                    <div>
                      <span style={{ fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:99, background:`${STATUS_CLR[lead.status]}18`, color:STATUS_CLR[lead.status] }}>
                        {STATUS_LBL[lead.status]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════ AGENTS TAB ══════════════════ */}
        {tab==='agents' && (
          <div>
            <div style={{ fontSize:13, color:G.muted, marginBottom:20, display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'#0d0d12', borderRadius:8, border:`1px solid ${G.border}` }}>
              <span style={{ fontSize:18 }}>⠿</span>
              <span>Agenten-Karten sind <strong style={{ color:G.text }}>Drag & Drop</strong> fähig – ziehe sie in Pool-Felder im <strong style={{ color:G.accent }}>Pools-Tab</strong>. Pool-Zuweisung auch per Dropdown direkt auf der Karte möglich.</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
              {agents.map(agent => (
                <AgentCard key={agent.id}
                  agent={agent} pools={pools} leads={leads}
                  isOpen={noteAgent===agent.id}
                  noteText={noteText} noteOutcome={noteOutcome} noteResult={noteResult} noteLoad={noteLoad}
                  dragAgent={dragAgent}
                  onDragStart={onDragStart}
                  onToggle={()=>{ setNoteAgent(noteAgent===agent.id?null:agent.id); setNoteText(''); setNoteResult(null); }}
                  onNoteText={setNoteText} onNoteOutcome={setNoteOutcome} onAnalyze={analyzeNote}
                  onAddPool={addAgentToPool} onRemovePool={removeFromPool}
                  getPool={getPool}
                  compColor={compColor}
                  G={G} btn={btn} inp={inp} card={card}
                />
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════ POOLS TAB ══════════════════ */}
        {tab==='pools' && (
          <div>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:16 }}>Pool-Verwaltung</div>
                <div style={{ fontSize:12, color:G.muted, marginTop:4 }}>Erstelle Pools · Weise Agenten per Drag & Drop zu · KI kategorisiert Leads automatisch</div>
              </div>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <button onClick={aiCategorize} disabled={aiLoading} style={{ ...btn, background:`${G.accent}12`, borderColor:`${G.accent}40`, color:G.accent, fontWeight:700 }}>
                  {aiLoading?'⏳ KI läuft...':'🤖 KI-Selektion starten'}
                </button>
                <button onClick={()=>setShowCP(true)} style={{ ...btn, background:G.accent, color:'#000', fontWeight:700, border:'none' }}>
                  + Pool erstellen
                </button>
              </div>
            </div>

            {/* AI Log */}
            {aiLog.length>0 && (
              <div style={{ ...card, padding:'16px', marginBottom:20, border:`1px solid ${G.accent}25`, background:`${G.accent}04` }}>
                <div style={{ fontSize:11, color:G.accent, fontWeight:700, marginBottom:12, textTransform:'uppercase', letterSpacing:0.7 }}>
                  KI-SELEKTION — {aiLog.length} Leads kategorisiert
                </div>
                <div style={{ display:'grid', gap:7 }}>
                  {aiLog.map((e,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:12, lineHeight:1.5 }}>
                      <span style={{ flexShrink:0, width:7, height:7, borderRadius:'50%', background:e.color, marginTop:4, display:'inline-block' }} />
                      <span style={{ color:G.text, fontWeight:600, flexShrink:0, minWidth:160 }}>{e.company}</span>
                      <span style={{ color:e.color, fontWeight:600, flexShrink:0 }}>→ {e.pool}</span>
                      <span style={{ color:G.dim }}>— {e.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ padding:'10px 16px', border:`1px dashed ${G.border}`, borderRadius:8, fontSize:12, color:G.dim, marginBottom:20, textAlign:'center' }}>
              ⠿ Wechsle zum <strong style={{ color:G.accent }}>Agenten-Tab</strong> und ziehe Karten per Drag & Drop in die Pool-Felder unten
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:16 }}>
              {pools.map(pool => {
                const poolLeads = leads.filter(l => l.pool===pool.id);
                const isDrop    = dropTarget===pool.id && dragAgent;
                return (
                  <div key={pool.id}
                    onDragOver={e=>{e.preventDefault();setDropTarget(pool.id);}}
                    onDragLeave={()=>setDropTarget(null)}
                    onDrop={e=>onDrop(e,pool.id)}
                    style={{ ...card, padding:'18px', border:`1px solid ${isDrop?pool.color:G.border}`, background:isDrop?`${pool.color}06`:G.card, transition:'all 0.2s', position:'relative' }}>

                    {isDrop && (
                      <div style={{ position:'absolute', inset:0, borderRadius:12, border:`2px dashed ${pool.color}70`, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none', zIndex:5, background:`${pool.color}06` }}>
                        <div style={{ background:G.card, padding:'6px 16px', borderRadius:8, color:pool.color, fontWeight:700, fontSize:13, border:`1px solid ${pool.color}40` }}>Hier ablegen</div>
                      </div>
                    )}

                    {/* Pool header */}
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                      <div style={{ width:14, height:14, borderRadius:'50%', background:pool.color, flexShrink:0, boxShadow:`0 0 8px ${pool.color}50` }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:15 }}>{pool.name}</div>
                        <div style={{ fontSize:11, color:G.muted, marginTop:2 }}>{pool.description}</div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontWeight:800, fontSize:24, color:pool.color, fontFamily:'monospace', lineHeight:1 }}>{poolLeads.length}</div>
                        <div style={{ fontSize:10, color:G.dim }}>Leads</div>
                      </div>
                    </div>

                    {/* Agents */}
                    <div style={{ marginBottom:14 }}>
                      <div style={{ fontSize:10, color:G.dim, marginBottom:8, textTransform:'uppercase', letterSpacing:0.7, fontWeight:600 }}>AGENTEN ({pool.agents.length})</div>
                      {pool.agents.length===0
                        ? <div style={{ fontSize:12, color:'#2a2a30', padding:'14px', border:`1px dashed #1a1a22`, borderRadius:8, textAlign:'center' }}>Agenten hier hineinziehen ⠿</div>
                        : <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                            {pool.agents.map(agId => {
                              const a = getAgent(agId);
                              return a ? (
                                <div key={agId} style={{ display:'flex', alignItems:'center', gap:5, background:'#0d0d12', border:`1px solid ${G.border}`, borderRadius:99, padding:'3px 10px 3px 5px' }}>
                                  <div style={{ width:20, height:20, borderRadius:'50%', background:`${G.accent}15`, color:G.accent, fontSize:8, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{a.initials}</div>
                                  <span style={{ fontSize:11, color:'#aaa' }}>{a.name.split(' ')[0]}</span>
                                  <span onClick={()=>removeFromPool(agId,pool.id)} style={{ cursor:'pointer', color:G.dim, fontSize:15, lineHeight:1, marginLeft:2 }}>×</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                      }
                    </div>

                    {/* Lead preview */}
                    {poolLeads.length>0 && (
                      <div>
                        <div style={{ fontSize:10, color:G.dim, marginBottom:6, textTransform:'uppercase', letterSpacing:0.7, fontWeight:600 }}>LEADS IN POOL</div>
                        {poolLeads.slice(0,4).map(lead => (
                          <div key={lead.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${G.border}` }}>
                            <div>
                              <div style={{ fontSize:12, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:170 }}>{lead.company}</div>
                              <div style={{ fontSize:10, color:G.muted }}>{lead.industry}</div>
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
                              <div style={{ width:36, height:3, background:'#1a1a22', borderRadius:3, overflow:'hidden' }}>
                                <div style={{ height:'100%', width:`${lead.completeness}%`, background:compColor(lead.completeness) }} />
                              </div>
                              <span style={{ fontSize:10, color:compColor(lead.completeness), fontFamily:'monospace', minWidth:28 }}>{lead.completeness}%</span>
                            </div>
                          </div>
                        ))}
                        {poolLeads.length>4 && <div style={{ fontSize:11, color:G.dim, marginTop:6, textAlign:'right' }}>+{poolLeads.length-4} weitere</div>}
                      </div>
                    )}

                    {pool.agents.length===0 && poolLeads.length===0 && (
                      <button onClick={()=>setPools(prev=>prev.filter(p=>p.id!==pool.id))} style={{ ...btn, width:'100%', justifyContent:'center', marginTop:12, color:G.red, borderColor:`${G.red}30`, fontSize:12 }}>
                        Pool löschen
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ══ ASSIGN MODAL ══ */}
      {showAssign && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, padding:20 }}>
          <div style={{ ...card, width:'100%', maxWidth:500, padding:26, maxHeight:'85vh', overflowY:'auto' }}>
            <div style={{ fontWeight:800, fontSize:18, marginBottom:6 }}>Leads zuweisen</div>
            <div style={{ fontSize:13, color:G.muted, marginBottom:20 }}>{sel.size} Lead{sel.size>1?'s':''} · Leads werden gleichmäßig auf die gewählten Agenten verteilt</div>

            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, color:G.dim, marginBottom:8, textTransform:'uppercase', letterSpacing:0.7 }}>Ausgewählte Leads</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                {[...sel].map(id => { const l = leads.find(x=>x.id===id); return l?<span key={id} style={{ fontSize:11, padding:'3px 9px', borderRadius:99, background:'#1a1a20', color:'#888' }}>{l.company}</span>:null; })}
              </div>
            </div>

            <div style={{ fontSize:11, color:G.dim, marginBottom:10, textTransform:'uppercase', letterSpacing:0.7 }}>Agenten auswählen (Mehrfachauswahl)</div>
            {agents.map(agent => {
              const isSel = assignTo.includes(agent.id);
              return (
                <div key={agent.id} onClick={()=>setAssignTo(prev=>isSel?prev.filter(id=>id!==agent.id):[...prev,agent.id])}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:10, border:`1px solid ${isSel?`${G.accent}50`:G.border}`, background:isSel?`${G.accent}07`:'transparent', cursor:'pointer', marginBottom:8, transition:'all 0.15s' }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:`${G.accent}15`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, color:isSel?G.accent:G.muted, flexShrink:0 }}>{agent.initials}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:14 }}>{agent.name}</div>
                    <div style={{ fontSize:11, color:G.muted }}>
                      {agent.leads.length} Leads · {agent.calls} Anrufe · {agent.conversions} Abschlüsse
                    </div>
                  </div>
                  <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${isSel?G.accent:'#333'}`, background:isSel?G.accent:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {isSel && <span style={{ color:'#000', fontSize:13, fontWeight:900, lineHeight:1 }}>✓</span>}
                  </div>
                </div>
              );
            })}

            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button onClick={()=>{setShowAssign(false);setAssignTo([]);}} style={{ ...btn, flex:1, justifyContent:'center' }}>Abbrechen</button>
              <button onClick={doAssign} disabled={!assignTo.length} style={{ ...btn, flex:1, justifyContent:'center', background:G.accent, color:'#000', fontWeight:700, border:'none', opacity:assignTo.length?1:0.4 }}>
                Zuweisen ({assignTo.length} Agent{assignTo.length!==1?'en':''})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ CREATE POOL MODAL ══ */}
      {showCP && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, padding:20 }}>
          <div style={{ ...card, width:'100%', maxWidth:430, padding:26 }}>
            <div style={{ fontWeight:800, fontSize:18, marginBottom:22 }}>Neuen Pool erstellen</div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, color:G.dim, textTransform:'uppercase', letterSpacing:0.7, display:'block', marginBottom:6 }}>Pool-Name *</label>
              <input value={newPool.name} onChange={e=>setNewPool(p=>({...p,name:e.target.value}))} placeholder="z.B. Premium Gastronomie Leads" style={inp} />
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, color:G.dim, textTransform:'uppercase', letterSpacing:0.7, display:'block', marginBottom:6 }}>Beschreibung</label>
              <input value={newPool.description} onChange={e=>setNewPool(p=>({...p,description:e.target.value}))} placeholder="Kriterien und Zielgruppe..." style={inp} />
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={{ fontSize:11, color:G.dim, textTransform:'uppercase', letterSpacing:0.7, display:'block', marginBottom:8 }}>Pool-Farbe</label>
              <div style={{ display:'flex', gap:10 }}>
                {POOL_COLS.map(c => (
                  <div key={c} onClick={()=>setNewPool(p=>({...p,color:c}))} style={{ width:30, height:30, borderRadius:'50%', background:c, cursor:'pointer', border:`3px solid ${newPool.color===c?'#fff':'transparent'}`, transition:'all 0.15s' }} />
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setShowCP(false)} style={{ ...btn, flex:1, justifyContent:'center' }}>Abbrechen</button>
              <button onClick={doCreate} disabled={!newPool.name.trim()} style={{ ...btn, flex:1, justifyContent:'center', background:newPool.color, color:'#000', fontWeight:700, border:'none', opacity:newPool.name.trim()?1:0.4 }}>
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AGENT CARD ────────────────────────────────────────────────
function AgentCard({ agent, pools, leads, isOpen, noteText, noteOutcome, noteResult, noteLoad, dragAgent, onDragStart, onToggle, onNoteText, onNoteOutcome, onAnalyze, onAddPool, onRemovePool, getPool, compColor, G, btn, inp, card }) {
  const [poolSel, setPoolSel] = useState('');
  const agLeads   = leads.filter(l => l.agent===agent.id);
  const statusC   = AGENT_CLR[agent.status];
  const statusLbl = { active:'Aktiv', pause:'Pause', offline:'Offline' }[agent.status];

  return (
    <div draggable onDragStart={e=>onDragStart(e,agent.id)}
      style={{ ...card, padding:'18px', cursor:'grab', transition:'all 0.2s', opacity:dragAgent===agent.id?0.4:1 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
        <div style={{ position:'relative', flexShrink:0 }}>
          <div style={{ width:46, height:46, borderRadius:'50%', background:`${statusC}15`, border:`2px solid ${statusC}35`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:15, color:statusC }}>
            {agent.initials}
          </div>
          <div style={{ position:'absolute', bottom:1, right:1, width:10, height:10, borderRadius:'50%', background:statusC, border:'2px solid #111117' }} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:14 }}>{agent.name}</div>
          <div style={{ fontSize:11, color:G.muted, marginTop:2 }}>{agent.id} · {statusLbl}</div>
        </div>
        <div title="Ziehen zum Pool" style={{ fontSize:14, color:'#2a2a35', cursor:'grab', userSelect:'none', letterSpacing:1 }}>⠿⠿</div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:14 }}>
        {[{label:'Anrufe',val:agent.calls},{label:'Abschlüsse',val:agent.conversions},{label:'Leads',val:agLeads.length}].map(s => (
          <div key={s.label} style={{ background:'#0a0a0e', border:`1px solid ${G.border}`, borderRadius:8, padding:'8px', textAlign:'center' }}>
            <div style={{ fontWeight:700, fontSize:18, fontFamily:'monospace' }}>{s.val}</div>
            <div style={{ fontSize:10, color:G.dim, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pool badges */}
      {agent.pools.length>0 && (
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10, color:G.dim, marginBottom:6, textTransform:'uppercase', letterSpacing:0.7 }}>POOLS</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
            {agent.pools.map(pid => {
              const p = getPool(pid);
              return p ? (
                <span key={pid} style={{ fontSize:11, padding:'3px 9px', borderRadius:99, background:`${p.color}15`, color:p.color, border:`1px solid ${p.color}40`, display:'inline-flex', alignItems:'center', gap:5 }}>
                  {p.name}
                  <span onClick={()=>onRemovePool(agent.id,pid)} style={{ cursor:'pointer', opacity:0.6, fontSize:13, lineHeight:1 }}>×</span>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Pool dropdown assign */}
      <div style={{ display:'flex', gap:6, marginBottom:10 }}>
        <select value={poolSel} onChange={e=>setPoolSel(e.target.value)} style={{ ...inp, flex:1, fontSize:12, cursor:'pointer' }}>
          <option value="">Pool zuweisen...</option>
          {pools.filter(p=>!agent.pools.includes(p.id)).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button onClick={()=>{if(poolSel){onAddPool(agent.id,poolSel);setPoolSel('');}}} disabled={!poolSel}
          style={{ ...btn, padding:'8px 14px', background:poolSel?`${G.accent}15`:'transparent', borderColor:poolSel?`${G.accent}40`:G.border, color:poolSel?G.accent:G.dim, fontSize:14, fontWeight:700 }}>
          +
        </button>
      </div>

      {/* Call Note toggle */}
      <button onClick={onToggle} style={{ ...btn, width:'100%', justifyContent:'center', background:isOpen?`${G.accent}12`:'transparent', borderColor:isOpen?`${G.accent}40`:G.border, color:isOpen?G.accent:G.muted, fontSize:12, marginBottom:isOpen?12:0, fontFamily:'inherit' }}>
        📋 Anruf-Notiz einfügen {agent.callNotes.length>0?`(${agent.callNotes.length})`:''}
      </button>

      {/* Call Note panel */}
      {isOpen && (
        <div style={{ background:'#0a0a0e', border:`1px solid ${G.border}`, borderRadius:10, padding:14 }}>
          <div style={{ fontSize:11, color:G.dim, marginBottom:8, textTransform:'uppercase', letterSpacing:0.7, fontWeight:600 }}>GESPRÄCHSERGEBNIS</div>
          <select value={noteOutcome} onChange={e=>onNoteOutcome(e.target.value)} style={{ ...inp, marginBottom:10, fontSize:12, cursor:'pointer' }}>
            <option value="interested">✅ Interessiert</option>
            <option value="not_interested">❌ Nicht interessiert</option>
            <option value="callback">📞 Rückruf vereinbart</option>
            <option value="closed">🏆 Abschluss erzielt</option>
            <option value="no_answer">📵 Nicht erreichbar</option>
          </select>

          <textarea value={noteText} onChange={e=>onNoteText(e.target.value)}
            placeholder="Gesprächsnotiz: Was wurde besprochen? Interesse, Einwände, nächste Schritte..."
            style={{ ...inp, minHeight:80, resize:'vertical', marginBottom:10, fontSize:12, fontFamily:'inherit' }} />

          <button onClick={onAnalyze} disabled={!noteText.trim()||noteLoad}
            style={{ ...btn, width:'100%', justifyContent:'center', background:G.accent, color:'#000', fontWeight:700, border:'none', opacity:(!noteText.trim()||noteLoad)?0.45:1, fontFamily:'inherit' }}>
            {noteLoad?'⏳ KI analysiert...':'🤖 KI-Analyse & Roadmap erstellen'}
          </button>

          {/* AI Result */}
          {noteResult && !noteResult.error && (
            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:11, color:G.accent, fontWeight:700, marginBottom:10, textTransform:'uppercase', letterSpacing:0.7 }}>KI ANALYSE</div>

              <div style={{ background:'#111117', borderRadius:8, padding:12, marginBottom:12 }}>
                <div style={{ fontSize:12, color:'#ccc', lineHeight:1.65, marginBottom:8 }}>{noteResult.zusammenfassung}</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                  {[
                    { label:noteResult.sentiment, c:noteResult.sentiment==='positiv'?G.accent:noteResult.sentiment==='negativ'?G.red:G.muted },
                    { label:`Prio: ${noteResult.prioritaet}`, c:noteResult.prioritaet==='hoch'?G.red:noteResult.prioritaet==='mittel'?G.amber:G.muted },
                    ...(noteResult.tags||[]).map(t=>({ label:`#${t}`, c:G.dim }))
                  ].map((tag,i) => (
                    <span key={i} style={{ fontSize:10, padding:'2px 8px', borderRadius:99, background:`${tag.c}15`, color:tag.c, border:`1px solid ${tag.c}30` }}>{tag.label}</span>
                  ))}
                </div>
              </div>

              {(noteResult.naechsteSchritte||[]).length>0 && (
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10, color:G.dim, marginBottom:8, textTransform:'uppercase', letterSpacing:0.7, fontWeight:600 }}>NÄCHSTE SCHRITTE</div>
                  {noteResult.naechsteSchritte.map((step,i) => (
                    <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:6 }}>
                      <div style={{ width:18, height:18, borderRadius:'50%', background:`${G.accent}15`, color:G.accent, fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{i+1}</div>
                      <span style={{ fontSize:12, color:'#bbb', lineHeight:1.55 }}>{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {(noteResult.roadmap||[]).length>0 && (
                <div>
                  <div style={{ fontSize:10, color:G.dim, marginBottom:8, textTransform:'uppercase', letterSpacing:0.7, fontWeight:600 }}>ROADMAP</div>
                  {noteResult.roadmap.map((r,i) => (
                    <div key={i} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:i<noteResult.roadmap.length-1?`1px solid ${G.border}`:'none' }}>
                      <div style={{ width:30, height:30, borderRadius:'50%', background:`${G.accent}15`, border:`1px solid ${G.accent}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:G.accent, flexShrink:0 }}>{i+1}</div>
                      <div>
                        <div style={{ fontSize:12, fontWeight:600, color:G.accent }}>{r.phase}</div>
                        <div style={{ fontSize:12, color:'#bbb', marginTop:2 }}>{r.aktion}</div>
                        <div style={{ fontSize:11, color:G.dim, marginTop:2 }}>⏱ {r.zeitrahmen}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {noteResult?.error && (
            <div style={{ marginTop:12, padding:10, background:`${G.red}12`, border:`1px solid ${G.red}30`, borderRadius:8, fontSize:12, color:G.red }}>{noteResult.msg}</div>
          )}

          {/* Previous notes */}
          {agent.callNotes.length>0 && (
            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:10, color:G.dim, marginBottom:7, textTransform:'uppercase', letterSpacing:0.7 }}>LETZTE NOTIZEN ({agent.callNotes.length})</div>
              {agent.callNotes.slice(-2).reverse().map(n => (
                <div key={n.id} style={{ background:'#111117', borderRadius:7, padding:'8px 11px', marginBottom:6, fontSize:11 }}>
                  <div style={{ color:G.dim, marginBottom:3 }}>{n.ts} · {n.outcome}</div>
                  <div style={{ color:'#888', lineHeight:1.5 }}>{n.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
