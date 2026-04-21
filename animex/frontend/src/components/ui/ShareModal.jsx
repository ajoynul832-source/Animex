'use client';
import { useState } from 'react';
import { Check, Copy, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import Modal from './Modal';
import { useToast } from './Toast';

export default function ShareModal({ open, onClose, title, url }) {
  const toast   = useToast();
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const twitter  = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title || 'Check this out!')}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  const facebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  const reddit   = () => window.open(`https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title || '')}`, '_blank');

  const btnStyle = (color) => ({
    flex: 1, height: 38, borderRadius: 7, border: 'none', background: color,
    color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    transition: 'opacity .15s',
  });

  return (
    <Modal open={open} onClose={onClose} title={`Share${title ? ` — ${title}` : ''}`} maxWidth={420}>
      {/* URL box */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <div style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 7, padding: '8px 12px', fontSize: 12, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {shareUrl}
        </div>
        <button onClick={copy} style={{ height: 36, padding: '0 14px', borderRadius: 7, border: '1px solid var(--border)', background: copied ? 'var(--accent-dim)' : 'var(--bg-card)', color: copied ? 'var(--accent)' : 'var(--text-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, transition: 'all .15s', flexShrink: 0 }}>
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Social buttons */}
      <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: 10 }}>Share on</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={twitter}  style={btnStyle('#1da1f2')}><Twitter size={14} /> Twitter</button>
        <button onClick={facebook} style={btnStyle('#1877f2')}><Facebook size={14} /> Facebook</button>
        <button onClick={reddit}   style={btnStyle('#ff4500')}><LinkIcon size={14} /> Reddit</button>
      </div>
    </Modal>
  );
}
