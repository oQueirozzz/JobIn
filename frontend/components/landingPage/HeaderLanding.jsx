'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HeaderLanding() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Início', href: '/' },
        { label: 'Vagas', href: '#vagas' },
        { label: 'Empresas', href: '#empresas' },
        { label: 'Sobre', href: '#sobre' }
    ];

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
        }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img 
                            src="/img/global/logo_completa.svg" 
                            className="h-16 w-auto object-contain cursor-pointer transition-transform hover:scale-105" 
                            alt="JobIn Logo" 
                            onClick={() => router.push('/')}
                        />
                        <nav className="hidden md:flex ml-10 space-x-8">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.label}
                                    href={item.href}
                                    className="text-gray-700 hover:text-[#8C1C13] font-medium transition-colors duration-300 relative group"
                                >
                                    {item.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8C1C13] transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-gray-700 hover:text-[#8C1C13] transition-colors duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                        </button>
                        <button className="text-gray-700 hover:text-[#8C1C13] transition-colors duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </button>
                        <button 
                            onClick={() => router.push('/cadEmpresas')}
                            className="bg-[#8C1C13] text-white px-6 py-2.5 rounded-full hover:bg-[#6b150e] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                        >
                            Publicar Vaga
                        </button>
                    </div>

                    <button 
                        className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}>
                    <nav className="py-4 space-y-4">
                        {navItems.map((item) => (
                            <Link 
                                key={item.label}
                                href={item.href}
                                className="block text-gray-700 hover:text-[#8C1C13] font-medium transition-colors duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <button 
                            onClick={() => {
                                router.push('/cadEmpresas');
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full bg-[#8C1C13] text-white px-6 py-2.5 rounded-full hover:bg-[#6b150e] transition-all duration-300"
                        >
                            Publicar Vaga
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
}
