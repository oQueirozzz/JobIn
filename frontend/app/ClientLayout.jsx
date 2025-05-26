'use client';

import "../public/css/globals.css";
import Footer from "../components/Footer/Footer";
import { usePathname } from 'next/navigation';
import Header from "../components/Header/Header";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const hideHeaderRoutes = ['/dashboard', '/'];
  const shouldHideHeader = hideHeaderRoutes.includes(pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      {children}
      <Footer />
    </>
  );
}
