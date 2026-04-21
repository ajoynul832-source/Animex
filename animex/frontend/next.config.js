/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.noitatnemucod.net' },
      { protocol: 'https', hostname: '**.gogoanime.run' },
      { protocol: 'https', hostname: 'gogocdn.net' },
      { protocol: 'https', hostname: '**.akamaized.net' },
      { protocol: 'https', hostname: 'cdn.myanimelist.net' },
      { protocol: 'https', hostname: 's4.anilist.co' },
      { protocol: 'https', hostname: '**.anilist.co' },
      { protocol: 'https', hostname: 'media.kitsu.io' },
      { protocol: 'https', hostname: '**.zorores.com' },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    NEXT_PUBLIC_API_URL:   process.env.NEXT_PUBLIC_API_URL   || 'http://localhost:5000/api',
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'AnimeX',
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options',        value: 'DENY' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
