'use client';

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react';

import {
  Loader2,
  AlertCircle
} from 'lucide-react';

const VideoPlayer = forwardRef(
  function VideoPlayer(
    {
      src,
      subtitleTracks = [],
      onReady,
      onError,
      onTimeUpdate,
      onEnded,
      autoPlay = true
    },
    ref
  ) {
    const videoRef =
      useRef(null);

    const hlsRef =
      useRef(null);

    const [state, setState] =
      useState('loading');
    /*
    loading
    ready
    error
    */

    const [errorMessage,
      setErrorMessage] =
      useState('');

    const [qualities,
      setQualities] =
      useState([]);

    const [currentQuality,
      setCurrentQuality] =
      useState(-1);
    /*
    -1 = auto
    */

    /*
    Expose native video element
    to parent page
    */
    useImperativeHandle(
      ref,
      () =>
        videoRef.current
    );

    useEffect(() => {
      if (!src) {
        setState(
          'loading'
        );
        return;
      }

      let mounted = true;

      const init =
        async () => {
          try {
            setState(
              'loading'
            );

            setErrorMessage(
              ''
            );

            setQualities(
              []
            );

            setCurrentQuality(
              -1
            );

            /*
            destroy previous HLS
            */
            if (
              hlsRef.current
            ) {
              hlsRef.current.destroy();
              hlsRef.current =
                null;
            }

            const video =
              videoRef.current;

            if (!video)
              return;

            /*
            clear previous source
            */
            video.pause();
            video.removeAttribute(
              'src'
            );
            video.load();

            /*
            .m3u8 support
            */
            const isM3U8 =
src.includes('.m3u8') ||
src.includes('mux.dev') ||
src.includes('m3u') ||
src.includes('.m3u');

            if (
              isM3U8
            ) {
              const Hls =
                (
                  await import(
                    'hls.js'
                  )
                ).default;

              if (
                Hls.isSupported()
              ) {
                const hls =
new Hls({
startLevel: -1,
enableWorker: true,
lowLatencyMode: false,
maxBufferLength: 60,
backBufferLength: 90
});

                hls.loadSource(
                  src
                );

                hls.attachMedia(
                  video
                );

                hls.on(
                  Hls.Events.MANIFEST_PARSED,
                  (
                    _,
                    data
                  ) => {
                    if (
                      !mounted
                    )
                      return;

                    const levels =
                      (
                        data?.levels ||
                        []
                      ).map(
                        (
                          level,
                          i
                        ) => ({
                          index:
                            i,
                          label:
                            level?.height
                              ? `${level.height}p`
                              : `Level ${i + 1}`
                        })
                      );

                    setQualities(
                      levels
                    );

                    setState(
                      'ready'
                    );

                    onReady?.();

                    if (
                      autoPlay
                    ) {
                      video
                        .play()
                        .catch(
                          () => {}
                        );
                    }
                  }
                );

                hls.on(
                  Hls.Events.LEVEL_SWITCHED,
                  (
                    _,
                    data
                  ) => {
                    setCurrentQuality(
                      data.level
                    );
                  }
                );

                hls.on(
                  Hls.Events.ERROR,
                  (
                    _,
                    data
                  ) => {
                    if (
                      !data?.fatal
                    )
                      return;

                    setState(
                      'error'
                    );

                    setErrorMessage(
                      'Stream unavailable. Try another server.'
                    );

                    onError?.();
                  }
                );

                hlsRef.current =
                  hls;

                return;
              }

              /*
              Safari native HLS
              */
              if (
                video.canPlayType(
                  'application/vnd.apple.mpegurl'
                )
              ) {
                video.src =
                  src;

                setState(
                  'ready'
                );

                onReady?.();

                if (
                  autoPlay
                ) {
                  video
                    .play()
                    .catch(
                      () => {}
                    );
                }

                return;
              }
            }

            /*
            Normal mp4 fallback
            */
            video.src = src;

            setState(
              'ready'
            );

            onReady?.();

            if (
              autoPlay
            ) {
              video
                .play()
                .catch(
                  () => {}
                );
            }
          } catch (
            err
          ) {
            setState(
              'error'
            );

            setErrorMessage(
              'Failed to load video stream.'
            );

            onError?.();
          }
        };

      init();

      return () => {
        mounted =
          false;

        if (
          hlsRef.current
        ) {
          hlsRef.current.destroy();
          hlsRef.current =
            null;
        }
      };
    }, [src]);

    const setLevel = (
      level
    ) => {
      if (
        hlsRef.current
      ) {
        hlsRef.current.currentLevel =
          level;
      }

      setCurrentQuality(
        level
      );
    };

    return (
      <div
        style={{
          position:
            'relative',
          width:
            '100%',
          height:
            '100%',
          minHeight:
            420,
          background:
            '#000'
        }}
      >
        {/* Loading */}
        {state ===
          'loading' && (
          <div
            style={{
              position:
                'absolute',
              inset: 0,
              display:
                'flex',
              flexDirection:
                'column',
              alignItems:
                'center',
              justifyContent:
                'center',
              gap: 12,
              zIndex: 5,
              background:
                '#050507'
            }}
          >
            <Loader2
              size={36}
              style={{
                color:
                  'var(--accent)',
                animation:
                  'spin 0.8s linear infinite'
              }}
            />

            <span
              style={{
                fontSize: 13,
                color:
                  'var(--text-3)'
              }}
            >
              Loading
              stream...
            </span>
          </div>
        )}

        {/* Error */}
        {state ===
          'error' && (
          <div
            style={{
              position:
                'absolute',
              inset: 0,
              display:
                'flex',
              flexDirection:
                'column',
              alignItems:
                'center',
              justifyContent:
                'center',
              gap: 10,
              zIndex: 5,
              background:
                '#050507',
              padding: 20,
              textAlign:
                'center'
            }}
          >
            <AlertCircle
              size={36}
              style={{
                color:
                  'var(--error)'
              }}
            />

            <p
              style={{
                fontSize: 13,
                color:
                  'var(--error)',
                maxWidth: 320
              }}
            >
              {
                errorMessage
              }
            </p>
          </div>
        )}

        {/* Video */}
        <video
          ref={
            videoRef
          }
          controls
          playsInline
          preload="auto"
          onTimeUpdate={(
            e
          ) =>
            onTimeUpdate?.(
              e.target
                .currentTime,
              e.target
                .duration
            )
          }
          onEnded={
            onEnded
          }
          style={{
            width:
              '100%',
            height:
              '100%',
            display:
              state ===
              'ready'
                ? 'block'
                : 'none',
            background:
              '#000'
          }}
        >
          {subtitleTracks.map(
            (
              track,
              i
            ) => (
              <track
                key={i}
                kind="subtitles"
                label={
                  track.label
                }
                srcLang={
                  track.lang
                }
                src={
                  track.src
                }
                default={
                  i === 0
                }
              />
            )
          )}
        </video>

        {/* Quality selector */}
        {state ===
          'ready' &&
          qualities.length >
            1 && (
            <div
              style={{
                position:
                  'absolute',
                top: 10,
                right: 10,
                zIndex: 10
              }}
            >
              <select
                value={
                  currentQuality
                }
                onChange={(
                  e
                ) =>
                  setLevel(
                    parseInt(
                      e.target
                        .value
                    )
                  )
                }
                style={{
                  background:
                    'rgba(0,0,0,0.75)',
                  border:
                    '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 5,
                  color:
                    '#fff',
                  fontSize: 11,
                  padding:
                    '4px 8px',
                  cursor:
                    'pointer'
                }}
              >
                <option
                  value={-1}
                >
                  Auto
                </option>

                {qualities.map(
                  (
                    q
                  ) => (
                    <option
                      key={
                        q.index
                      }
                      value={
                        q.index
                      }
                    >
                      {
                        q.label
                      }
                    </option>
                  )
                )}
              </select>
            </div>
          )}

        <style jsx global>{`
          @keyframes spin {
            to {
              transform: rotate(
                360deg
              );
            }
          }
        `}</style>
      </div>
    );
  }
);

export default VideoPlayer;
