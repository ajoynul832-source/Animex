import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight:'calc(100vh - 65px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', textAlign:'center' }}>
      <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:120, fontWeight:700, color:'var(--accent)', lineHeight:1, marginBottom:16, textShadow:'2px 0 var(--dub-color),-2px 0 var(--sub-color)', letterSpacing:'0.04em' }}>
        404
      </div>
      <h1 style={{ fontSize:24, fontWeight:700, color:'var(--text-1)', marginBottom:10 }}>Page not found</h1>
      <p style={{ fontSize:14, color:'var(--text-3)', maxWidth:360, lineHeight:1.7, marginBottom:32 }}>
        The page you&apos;re looking for doesn&apos;t exist or was removed.
      </p>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
        <Link href="/home" className="btn-watch" style={{ display:'inline-flex', alignItems:'center', gap:7 }}>🏠 Home</Link>
        <Link href="/search" style={{ display:'inline-flex', alignItems:'center', gap:7, height:42, padding:'0 20px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-2)', fontSize:13, fontWeight:600, textDecoration:'none' }}>🔍 Search</Link>
        <Link href="/random" style={{ display:'inline-flex', alignItems:'center', gap:7, height:42, padding:'0 20px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-2)', fontSize:13, fontWeight:600, textDecoration:'none' }}>🎲 Random</Link>
      </div>
    </div>
  );
}
