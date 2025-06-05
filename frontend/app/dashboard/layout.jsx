'use client';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});


export default function DashboardLayout({ children }) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${inter.variable}`}>
      {children}
    </div>
  );
} 
