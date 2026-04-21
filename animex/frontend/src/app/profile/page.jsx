'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Save, LogOut, CheckCircle, Settings, Bookmark, History, User } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { authApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

export default function ProfilePage() {
  const { user, logout } = useAuth(); const router = useRouter(); const toast = useToast();
  const [pw, setPw]       = useState({ current:'', newPw:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  if (!user) { router.push('/login'); return null; }

  const changePw = async (e) => {
    e.preventDefault();
    if (pw.newPw !== pw.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try { await authApi.changePassword({ currentPassword:pw.current, newPassword:pw.newPw }); toast.success('Password changed!'); setPw({current:'',newPw:'',confirm:''}); }
    catch (err) { toast.error(err.message||'Failed'); }
    finally { setLoading(false); }
  };

  const card = { background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:10, padding:22, marginBottom:14 };

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'28px 24px 48px' }}>
      <h1 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:28, fontWeight:700, color:'var(--text-1)', marginBottom:22, display:'flex', alignItems:'center', gap:10 }}>
        <User size={22} style={{ color:'var(--accent)' }}/> My Account
      </h1>

      {/* Profile card */}
      <div style={{ ...card, display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ width:60, height:60, borderRadius:'50%', background:'var(--accent-dim)', border:'2px solid var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Rajdhani,sans-serif', fontSize:26, fontWeight:700, color:'var(--accent)', flexShrink:0 }}>{user.name[0].toUpperCase()}</div>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:18, fontWeight:700, color:'var(--text-1)' }}>{user.name}</p>
          <p style={{ fontSize:13, color:'var(--text-3)' }}>{user.email}</p>
          {user.createdAt && <p style={{ fontSize:11, color:'var(--text-4)', marginTop:2 }}>Member since {new Date(user.createdAt).toLocaleDateString('en-US',{month:'long',year:'numeric'})}</p>}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <Link href="/watchlist" style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', background:'var(--bg-card-alt)', border:'1px solid var(--border)', borderRadius:6, fontSize:12, color:'var(--text-2)', textDecoration:'none' }}><Bookmark size={13}/> Watchlist</Link>
          <Link href="/history"   style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', background:'var(--bg-card-alt)', border:'1px solid var(--border)', borderRadius:6, fontSize:12, color:'var(--text-2)', textDecoration:'none' }}><History size={13}/> History</Link>
          <Link href="/settings"  style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', background:'var(--bg-card-alt)', border:'1px solid var(--border)', borderRadius:6, fontSize:12, color:'var(--text-2)', textDecoration:'none' }}><Settings size={13}/> Settings</Link>
        </div>
      </div>

      {/* Change password */}
      <div style={card}>
        <h2 style={{ fontSize:15, fontWeight:600, color:'var(--text-1)', display:'flex', alignItems:'center', gap:8, marginBottom:18 }}><Lock size={15} style={{ color:'var(--accent)' }}/> Change Password</h2>
        <form onSubmit={changePw}>
          {[['Current Password','current'],['New Password','newPw'],['Confirm New Password','confirm']].map(([l,k]) => (
            <div key={k} style={{ marginBottom:12 }}>
              <label className="auth-label">{l}</label>
              <input className="auth-input" type="password" value={pw[k]} onChange={e=>setPw(p=>({...p,[k]:e.target.value}))} required/>
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ display:'inline-flex', alignItems:'center', gap:7, height:36, padding:'0 18px', background:'var(--accent)', color:'#111', border:'none', borderRadius:6, fontSize:13, fontWeight:700, cursor:'pointer', opacity:loading?.6:1 }}>
            <Save size={13}/> {loading ? 'Saving…' : 'Save Password'}
          </button>
        </form>
      </div>

      {/* Danger */}
      <div style={{ ...card, borderColor:'rgba(248,113,113,0.2)' }}>
        <h2 style={{ fontSize:15, fontWeight:600, color:'var(--error)', marginBottom:12 }}>Sign Out</h2>
        <button onClick={() => { logout(); router.push('/home'); toast.info('Signed out'); }} style={{ display:'flex', alignItems:'center', gap:7, height:36, padding:'0 18px', background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', color:'var(--error)', borderRadius:6, fontSize:13, fontWeight:600, cursor:'pointer' }}>
          <LogOut size={13}/> Sign Out
        </button>
      </div>
    </div>
  );
}
