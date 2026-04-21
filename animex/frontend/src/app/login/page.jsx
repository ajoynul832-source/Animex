'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const { login } = useAuth(); const router = useRouter(); const toast = useToast();
  const [form, setForm] = useState({ login:'', password:'' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await login(form); toast.success('Welcome back!'); router.push('/home'); }
    catch (err) { setError(err.message||'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 16px' }}>
      <div style={{ position:'fixed', top:'40%', left:'50%', transform:'translate(-50%,-50%)', width:400, height:400, background:'radial-gradient(circle,rgba(202,233,98,0.05) 0%,transparent 70%)', pointerEvents:'none' }}/>
      <div className="auth-card">
        <div style={{ textAlign:'center', marginBottom:26 }}>
          <Link href="/home" style={{ fontFamily:'Rajdhani,sans-serif', fontSize:28, fontWeight:700, color:'var(--accent)', letterSpacing:'0.04em' }}>ANIME<span style={{ color:'var(--text-1)' }}>X</span></Link>
          <p style={{ fontSize:13, color:'var(--text-3)', marginTop:5 }}>Sign in to continue</p>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={submit}>
          <div style={{ marginBottom:14 }}>
            <label className="auth-label">Username or Email</label>
            <input className="auth-input" type="text" value={form.login} onChange={e=>setForm(f=>({...f,login:e.target.value}))} placeholder="Enter username or email" required/>
          </div>
          <div style={{ marginBottom:18 }}>
            <label className="auth-label">Password</label>
            <div style={{ position:'relative' }}>
              <input className="auth-input" type={showPw?'text':'password'} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Enter password" required style={{ paddingRight:40 }}/>
              <button type="button" onClick={()=>setShowPw(v=>!v)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--text-3)', cursor:'pointer', display:'flex' }}>{showPw?<EyeOff size={15}/>:<Eye size={15}/>}</button>
            </div>
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>{loading?'Signing in…':'Sign In'}</button>
        </form>
        <p style={{ textAlign:'center', fontSize:13, color:'var(--text-3)', marginTop:18 }}>
          No account? <Link href="/register" style={{ color:'var(--accent)', fontWeight:600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
