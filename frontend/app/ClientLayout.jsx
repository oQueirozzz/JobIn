'use client';

import "../public/css/globals.css";
import Footer from "../components/Footer/Footer";
import { usePathname } from 'next/navigation';
import Header from "../components/Header/Header";
import { AuthProvider } from '../hooks/useAuth';

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const hideHeaderRoutes = ['/dashboard', '/'];
  const shouldHideHeader = hideHeaderRoutes.includes(pathname);

  return (
    <AuthProvider>
      {!shouldHideHeader && <Header />}
      {children}
      <Footer />
    </AuthProvider>
  );
}
