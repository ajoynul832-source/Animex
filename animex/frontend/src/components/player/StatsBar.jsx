'use client';
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Eye, Share2, Bookmark, BookmarkCheck } from 'lucide-react';
import ShareModal from '@/components/ui/ShareModal';
import { useToast } from '@/components/ui/Toast';

export default function StatsBar({ stats = {}, onReact, reacted, inList, onToggleList, animeTitle }) {
  const toast = useToast();
  const [shareOpen, setShareOpen] = useState(false);

  const btn = (active, color) => ({
    display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px',
    background: active ? `${color}18` : 'var(--bg-card)',
    border: `1px solid ${active ? color : 'var(--border)'}`,
    borderRadius: 6, color: active ? color : 'var(--text-3)',
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif', transition: 'all .15s',
  });

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center' }}>
        <button style={btn(reacted === 'like', 'var(--accent)')} onClick={() => onReact('like')}>
          <ThumbsUp size={13} /> {(stats.likeCount || 0).toLocaleString()}
        </button>
        <button style={btn(reacted === 'dislike', 'var(--error)')} onClick={() => onReact('dislike')}>
          <ThumbsDown size={13} /> {(stats.dislikeCount || 0).toLocaleString()}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-3)', padding: '5px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6 }}>
          <Eye size={13} /> {(stats.totalViews || 0).toLocaleString()}
        </div>

        <button style={btn(inList, 'var(--accent)')} onClick={onToggleList}>
          {inList ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
          {inList ? 'Saved' : 'Save'}
        </button>

        <button style={btn(false, 'var(--info)')} onClick={() => setShareOpen(true)}>
          <Share2 size={13} /> Share
        </button>
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={animeTitle}
      />
    </>
  );
}
