'use client';
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, subtitleTracks = [], onReady, onError, onTimeUpdate, onEnded, autoPlay = true }, ref) {
  const videoRef  = useRef(null);
  const hlsRef    = useRef(null);
  const [state,   setState]   = useState('loading'); // loading | ready | error
  const [errMsg,  setErrMsg]  = useState('');
  const [quality, setQuality] = useState([]);
  const [curQual, setCurQual] = useState(-1); // -1 = auto

  // Expose video element ref to parent
  useImperativeHandle(ref, () => videoRef.current);

  useEffect(() => {
    if (!src) return;
    setState('loading'); setErrMsg('');

    const init = async () => {
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
      const Hls = (await import('hls.js')).default;

      if (Hls.isSupported()) {
        const hls = new Hls({
          startLevel: -1,
          enableWorker: true,
          maxBufferLength: 30,
          maxBufferSize: 60 * 1000 * 1000,
        });
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          setState('ready');
          const levels = data.levels.map((l, i) => ({
            index: i,
            label: l.height ? `${l.height}p` : `Level ${i}`,
          }));
          setQuality(levels);
          onReady?.();
          if (autoPlay) videoRef.current?.play().catch(() => {});
        });

        hls.on(Hls.Events.ERROR, (_, d) => {
          if (d.fatal) {
            setState('error');
            setErrMsg('Stream error. Try another server.');
            onError?.();
          }
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (_, d) => setCurQual(d.level));
        hlsRef.current = hls;
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = src;
        setState('ready');
        if (autoPlay) videoRef.current.play().catch(() => {});
      } else {
        setState('error');
        setErrMsg('HLS is not supported in this browser. Try Chrome or Firefox.');
        onError?.();
      }
    };

    init();
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
  }, [src]);

  const setLevel = (level) => {
    if (hlsRef.current) hlsRef.current.currentLevel = level;
    setCurQual(level);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
      {state === 'loading' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 5, background: '#050507' }}>
          <Loader2 size={36} style={{ color: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Loading stream…</span>
        </div>
      )}
      {state === 'error' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, zIndex: 5, background: '#050507', padding: 20, textAlign: 'center' }}>
          <AlertCircle size={36} style={{ color: 'var(--error)' }} />
          <p style={{ fontSize: 13, color: 'var(--error)', maxWidth: 280 }}>{errMsg}</p>
        </div>
      )}
      <video
        ref={videoRef}
        controls
        playsInline
        onTimeUpdate={e => onTimeUpdate?.(e.target.currentTime, e.target.duration)}
        onEnded={onEnded}
        style={{ width: '100%', height: '100%', display: state === 'ready' ? 'block' : 'none' }}
      >
        {subtitleTracks.map((t, i) => (
          <track key={i} kind="subtitles" label={t.label} srcLang={t.lang} src={t.src} default={i === 0} />
        ))}
      </video>

      {/* Quality selector overlay */}
      {state === 'ready' && quality.length > 1 && (
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
          <select
            value={curQual}
            onChange={e => setLevel(parseInt(e.target.value))}
            style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 5, color: '#fff', fontSize: 11, padding: '3px 8px', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
          >
            <option value={-1}>Auto</option>
            {quality.map(q => <option key={q.index} value={q.index}>{q.label}</option>)}
          </select>
        </div>
      )}
      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
});

export default VideoPlayer;
