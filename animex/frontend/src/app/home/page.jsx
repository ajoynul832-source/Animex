'use client';
import { useEffect, useState } from 'react';
import { animeApi } from '@/lib/api';

export default function HomePage() {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    animeApi
      .getHome()
      .then((d) => {
        setHome(d?.data || null);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        padding: 40,
        background: '#111',
        color: 'white',
        minHeight: '100vh'
      }}
    >
      <h1>Frontend Test Page</h1>

      <p style={{ marginTop: 20 }}>
        Loading: {String(loading)}
      </p>

      <p style={{ marginTop: 20 }}>
        Backend Response:
      </p>

      <pre
        style={{
          marginTop: 20,
          fontSize: 12,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          background: '#1a1a1a',
          padding: 20,
          borderRadius: 8,
          overflow: 'auto'
        }}
      >
        {JSON.stringify(home, null, 2)}
      </pre>
    </div>
  );
}
