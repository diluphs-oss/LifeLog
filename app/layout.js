import './globals.css';

export const metadata = {
  title: 'LifeLog',
  description: "Dilu's daily life tracker",
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#10120f',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>{children}</body>
    </html>
  );
}
