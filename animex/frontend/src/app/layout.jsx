import '@/styles/globals.css';
import { AuthProvider }  from '@/lib/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import Navbar            from '@/components/layout/Navbar';
import Sidebar           from '@/components/layout/Sidebar';
import Footer            from '@/components/layout/Footer';
import ProgressBar       from '@/components/ui/ProgressBar';

export const metadata = {
  title:       { default: 'AnimeX — Watch Anime Free in HD', template: '%s | AnimeX' },
  description: 'Watch anime online free in HD. Latest sub & dub episodes. No ads.',
  themeColor:  '#18191f',
  manifest:    '/manifest.json',
  viewport:    'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            <ProgressBar />
            <Navbar />
            <div id="sidebar-overlay" onClick={() => {
              document.getElementById('site-sidebar')?.classList.remove('open');
              document.getElementById('sidebar-overlay')?.classList.remove('active');
            }} />
            <div id="wrapper">
              <Sidebar />
              <div id="main-content">
                {children}
                <Footer />
              </div>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
