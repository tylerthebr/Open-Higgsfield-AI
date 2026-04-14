import './globals.css';

export const metadata = {
  title: 'Open Higgsfield AI — Free AI Image & Video Studio',
  description: 'Generate AI images and videos using 200+ models — Flux, Midjourney, Kling, Veo, Seedance and more. Free open-source alternative to Higgsfield AI.',
  keywords: ['AI image generator', 'AI video generator', 'Flux', 'Midjourney', 'open source'],
  // personal fork - added viewport meta for better mobile experience
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // allow pinch-to-zoom for accessibility
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
