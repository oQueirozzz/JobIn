'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

    const handleNavClick = (e, href) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    const navItems = [
        { label: 'Início', href: '#hero' },
        { label: 'Vagas', href: '#jobs' },
        { label: 'Empresas', href: '#empresas' },
        { label: 'Como Funciona', href: '#como-funciona' }
    ];

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
        }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="flex items-center">
                            <Image
                                src="/img/global/logo_completa.svg"
                                alt="JobIn Logo"
                                width={120}
                                height={40}
                                className="h-8 w-auto"
                            />
                        </Link>
                        <nav className="hidden md:flex ml-10 space-x-8">
                            {navItems.map((item) => (
                                <a 
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item.href)}
                                    className="text-gray-700 hover:text-[#7B2D26] font-medium transition-colors duration-300 relative group cursor-pointer"
                                >
                                    {item.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#7B2D26] transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link 
                            href="/login"
                            className="text-gray-700 hover:text-[#7B2D26] font-medium transition-colors duration-300 relative group"
                        >
                            Entrar
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#7B2D26] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link 
                            href="/cadAlunos"
                            className="text-gray-700 hover:text-[#7B2D26] font-medium transition-colors duration-300 relative group"
                        >
                            Cadastrar-se
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#7B2D26] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
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
                            <a 
                                key={item.label}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className="block text-gray-700 hover:text-[#7B2D26] font-medium transition-colors duration-300 cursor-pointer"
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="pt-4 space-y-3">
                            <Link 
                                href="/login"
                                className="block text-gray-700 hover:text-[#7B2D26] font-medium transition-colors duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Entrar
                            </Link>
                            <Link 
                                href="/cadAlunos"
                                className="block text-gray-700 hover:text-[#7B2D26] font-medium transition-colors duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sou Aluno
                            </Link>
                            <Link 
                                href="/cadEmpresas"
                                className="block w-full bg-[#7B2D26] text-white px-6 py-2.5 rounded-full hover:bg-opacity-90 transition-all duration-300 text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Publicar Vaga
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
