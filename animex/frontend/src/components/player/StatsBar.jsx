'use client';

import { useState } from 'react';

import {
  ThumbsUp,
  ThumbsDown,
  Eye,
  Share2,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

import ShareModal from '@/components/ui/ShareModal';
import { useToast } from '@/components/ui/Toast';

export default function StatsBar({
  stats = {},
  onReact,
  reacted,
  inList,
  onToggleList,
  animeTitle
}) {
  const toast =
    useToast();

  const [shareOpen,
    setShareOpen] =
    useState(false);

  /*
  Safe normalized stats
  */

  const likeCount =
    Number(
      stats?.likeCount ||
      0
    );

  const dislikeCount =
    Number(
      stats?.dislikeCount ||
      0
    );

  const totalViews =
    Number(
      stats?.totalViews ||
      0
    );

  const buttonStyle = (
    active,
    color
  ) => ({
    display: 'flex',
    alignItems:
      'center',
    gap: 5,
    padding:
      '6px 12px',
    background:
      active
        ? `${color}18`
        : 'var(--bg-card)',
    border: `1px solid ${
      active
        ? color
        : 'var(--border)'
    }`,
    borderRadius: 6,
    color:
      active
        ? color
        : 'var(--text-3)',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily:
      'Montserrat, sans-serif',
    transition:
      'all .15s',
    minHeight: 36
  });

  const handleReact = (
    type
  ) => {
    if (
      reacted
    ) {
      toast.info(
        'Reaction already added'
      );
      return;
    }

    onReact?.(
      type
    );
  };

  const handleSave =
    () => {
      onToggleList?.();
    };

  return (
    <>
      <div
        style={{
          display:
            'flex',
          flexWrap:
            'wrap',
          gap: 7,
          alignItems:
            'center'
        }}
      >
        {/* Like */}
        <button
          style={buttonStyle(
            reacted ===
              'like',
            'var(--accent)'
          )}
          onClick={() =>
            handleReact(
              'like'
            )
          }
        >
          <ThumbsUp size={13} />

          {likeCount.toLocaleString()}
        </button>

        {/* Dislike */}
        <button
          style={buttonStyle(
            reacted ===
              'dislike',
            'var(--error)'
          )}
          onClick={() =>
            handleReact(
              'dislike'
            )
          }
        >
          <ThumbsDown size={13} />

          {dislikeCount.toLocaleString()}
        </button>

        {/* Views */}
        <div
          style={{
            display:
              'flex',
            alignItems:
              'center',
            gap: 5,
            fontSize: 12,
            color:
              'var(--text-3)',
            padding:
              '6px 12px',
            background:
              'var(--bg-card)',
            border:
              '1px solid var(--border)',
            borderRadius: 6,
            minHeight: 36
          }}
        >
          <Eye size={13} />

          {totalViews.toLocaleString()}
        </div>

        {/* Watchlist */}
        <button
          style={buttonStyle(
            inList,
            'var(--accent)'
          )}
          onClick={
            handleSave
          }
        >
          {inList ? (
            <BookmarkCheck size={13} />
          ) : (
            <Bookmark size={13} />
          )}

          {inList
            ? 'Saved'
            : 'Save'}
        </button>

        {/* Share */}
        <button
          style={buttonStyle(
            false,
            'var(--info)'
          )}
          onClick={() =>
            setShareOpen(
              true
            )
          }
        >
          <Share2 size={13} />
          Share
        </button>
      </div>

      <ShareModal
        open={
          shareOpen
        }
        onClose={() =>
          setShareOpen(
            false
          )
        }
        title={
          animeTitle ||
          'Anime'
        }
      />
    </>
  );
}
