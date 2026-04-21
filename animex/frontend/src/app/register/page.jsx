'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/Toast';

export default function RegisterPage() {
  const { register } = useAuth(); const router = useRouter(); const toast = useToast();
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true); setError('');
    try { await register({ name:form.name, email:form.email, password:form.password }); toast.success('Account created! Welcome!'); router.push('/home'); }
    catch (err) { setError(err.message||'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 16px' }}>
      <div className="auth-card">
        <div style={{ textAlign:'center', marginBottom:26 }}>
          <Link href="/home" style={{ fontFamily:'Rajdhani,sans-serif', fontSize:28, fontWeight:700, color:'var(--accent)' }}>ANIME<span style={{ color:'var(--text-1)' }}>X</span></Link>
          <p style={{ fontSize:13, color:'var(--text-3)', marginTop:5 }}>Create a free account</p>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={submit}>
          {[['Username','name','text','Choose a username'],['Email','email','email','Your email address']].map(([l,k,t,p]) => (
            <div key={k} style={{ marginBottom:12 }}>
              <label className="auth-label">{l}</label>
              <input className="auth-input" type={t} value={form[k]} onChange={set(k)} placeholder={p} required/>
            </div>
          ))}
          {['password','confirm'].map(k => (
            <div key={k} style={{ marginBottom: k==='password'?12:18 }}>
              <label className="auth-label">{k==='password'?'Password':'Confirm Password'}</label>
              <div style={{ position:'relative' }}>
                <input className="auth-input" type={showPw?'text':'password'} value={form[k]} onChange={set(k)} placeholder={k==='password'?'Min. 6 chars':'Repeat password'} required style={{ paddingRight:40 }}/>
                {k==='password' && <button type="button" onClick={()=>setShowPw(v=>!v)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--text-3)', cursor:'pointer', display:'flex' }}>{showPw?<EyeOff size={15}/>:<Eye size={15}/>}</button>}
              </div>
            </div>
          ))}
          <button type="submit" className="auth-submit" disabled={loading}>{loading?'Creating account…':'Create Account'}</button>
        </form>
        <p style={{ textAlign:'center', fontSize:13, color:'var(--text-3)', marginTop:18 }}>
          Already have an account? <Link href="/login" style={{ color:'var(--accent)', fontWeight:600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
