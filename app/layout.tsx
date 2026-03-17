import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDXL Unlimited Image Generator',
  description: 'Generate high-quality images with Stable Diffusion XL',
};

export default function RootLayout({
  children,
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white min-h-screen">{children}</body>
    </html>
  );
}