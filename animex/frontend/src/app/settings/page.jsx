'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Monitor, Bell, Trash2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useWatchProgress } from '@/hooks/useWatchProgress';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const router   = useRouter();
  const toast    = useToast();
  const { clearAll: clearProgress } = useWatchProgress();
  const [defaultCat, setDefaultCat] = useLocalStorage('animex_default_cat', 'sub');
  const [defaultSrv, setDefaultSrv] = useLocalStorage('animex_default_srv', 'hd-1');
  const [autoNext,  setAutoNext]    = useLocalStorage('animex_auto_next', true);
  const [skipInto,  setSkipIntro]   = useLocalStorage('animex_skip_intro', false);

  if (!user) { router.push('/login'); return null; }

  const card = { background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:10, padding:22, marginBottom:14 };
  const row  = { display:'flex', alignItems:'center', justifyContent:'space-between', paddingBottom:12, borderBottom:'1px solid var(--border)', marginBottom:12 };

  const Toggle = ({ val, set }) => (
    <button onClick={() => set(!val)} style={{ width:42, height:22, borderRadius:11, background: val?'var(--accent)':'var(--bg-card-alt)', border:'1px solid var(--border)', cursor:'pointer', position:'relative', transition:'all .2s' }}>
      <span style={{ position:'absolute', top:2, left: val?20:2, width:16, height:16, borderRadius:'50%', background: val?'#111':'var(--text-3)', transition:'left .2s' }}/>
    </button>
  );

  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'28px 24px 48px' }}>
      <h1 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:28, fontWeight:700, color:'var(--text-1)', marginBottom:22, display:'flex', alignItems:'center', gap:10 }}>
        <Settings size={22} style={{ color:'var(--accent)' }}/> Settings
      </h1>

      <div style={card}>
        <h2 style={{ fontSize:15, fontWeight:600, color:'var(--text-1)', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}><Monitor size={15} style={{ color:'var(--accent)' }}/> Player Defaults</h2>
        <div style={row}>
          <div><div style={{ fontWeight:500, color:'var(--text-1)', marginBottom:2 }}>Default Category</div><div style={{ fontSize:12, color:'var(--text-3)' }}>Prefer sub or dub when available</div></div>
          <div style={{ display:'flex', borderRadius:5, overflow:'hidden', border:'1px solid var(--border)' }}>
            {['sub','dub'].map(c => <button key={c} onClick={()=>setDefaultCat(c)} style={{ padding:'4px 14px', fontSize:12, fontWeight:700, textTransform:'uppercase', background:defaultCat===c?'var(--accent)':'transparent', color:defaultCat===c?'#111':'var(--text-3)', border:'none', cursor:'pointer', transition:'all .15s' }}>{c}</button>)}
          </div>
        </div>
        <div style={row}>
          <div><div style={{ fontWeight:500, color:'var(--text-1)', marginBottom:2 }}>Default Server</div><div style={{ fontSize:12, color:'var(--text-3)' }}>Preferred streaming server</div></div>
          <select value={defaultSrv} onChange={e=>setDefaultSrv(e.target.value)} style={{ height:32, background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:5, color:'var(--text-1)', fontSize:12, padding:'0 10px', outline:'none' }}>
            {['hd-1','hd-2','hd-3','StreamSB','StreamTape'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ ...row, borderBottom:'none', marginBottom:0, paddingBottom:0 }}>
          <div><div style={{ fontWeight:500, color:'var(--text-1)', marginBottom:2 }}>Auto-play Next Episode</div><div style={{ fontSize:12, color:'var(--text-3)' }}>Automatically start next episode</div></div>
          <Toggle val={autoNext} set={setAutoNext}/>
        </div>
      </div>

      <div style={card}>
        <h2 style={{ fontSize:15, fontWeight:600, color:'var(--text-1)', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}><Trash2 size={15} style={{ color:'var(--accent)' }}/> Data</h2>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
          <button onClick={() => { clearProgress(); toast.success('Watch progress cleared'); }} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', background:'var(--bg-card-alt)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-2)', fontSize:13, cursor:'pointer' }}>
            <Trash2 size={13}/> Clear Watch Progress
          </button>
        </div>
      </div>
    </div>
  );
}
