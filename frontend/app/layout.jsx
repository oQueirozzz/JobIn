'use client';

import "../public/css/globals.css";
import Footer from "../components/Footer/Footer"
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import Header from "../components/Header/Header";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

function ClientLayout({ children }) {
  const pathname = usePathname()

  // Rota onde o header global NÃO deve aparecer
  const hideHeaderRoutes = ['/app', '/']

  const shouldHideHeader = hideHeaderRoutes.includes(pathname)

  return (
    <>
      {!shouldHideHeader && <Header />}
      {children}
      <Footer />
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.variable}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
