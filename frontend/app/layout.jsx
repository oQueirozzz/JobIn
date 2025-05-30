import { Inter } from 'next/font/google';
import './../public/css/globals.css';
import ClientLayout from './ClientLayout'; // componente client separado

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: "JobIn",
  description: "Generated by create next app",
  icons: {
    icon: '/img/global/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.variable}   cz-shortcut-listen="true">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}