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
        { label: 'Como Funciona', href: '#como-funciona' }
    ];

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[#7B2D26] shadow-lg py-1'
                : 'bg-[#7B2D26]/95 backdrop-blur-sm py-4'
            }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="flex items-center">
                            <svg width="full" height="40" viewBox="0 0 830 330" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.73333 2.00283C7.33333 3.0695 4.13333 5.8695 2.66667 8.2695C0 12.6695 0 14.6695 0 165.336C0 314.003 0.133333 318.136 2.53333 321.87C7.73333 329.603 0.666667 329.203 141.467 329.336C271.467 329.336 271.6 329.336 275.2 326.536C283.067 320.27 282.667 329.87 282.667 164.403C282.667 14.5362 282.667 12.6695 280 8.2695C274.667 -0.397169 280.933 0.00283113 141.067 0.00283113C34.9333 0.136164 13.3333 0.402831 9.73333 2.00283ZM237.6 31.8695C239.6 33.6028 241.467 93.6028 242.133 178.67C242.933 269.203 242.267 290.27 238.267 294.27C234.8 297.736 220.4 298.803 163.333 299.47C103.2 300.27 50.6667 298.003 47.0667 294.27C44.4 291.603 41.6 259.87 40.5333 220.27L39.6 184.003H51.6C65.0667 184.003 90.5333 187.203 101.333 190.27C122.8 196.403 136 206.67 136 217.47C136 218.936 134.533 222.403 132.667 225.203C129.2 230.936 117.733 237.336 111.067 237.336C109.067 237.336 105.067 238.003 102.267 238.803C93.3333 241.203 90.9333 252.27 97.7333 258.803C100.4 261.336 101.733 261.47 110.667 260.936C120.533 260.27 123.2 259.603 134.133 254.536C146.133 249.07 155.733 237.07 160.267 222.003C166 202.403 168.667 166.67 167.467 121.336C166.933 102.67 166 80.1362 165.333 71.3362C164.533 62.5362 163.467 50.1362 162.933 43.6028C162.4 37.2028 162.4 31.4695 163.067 30.8028C164.267 29.6028 236.133 30.5362 237.6 31.8695Z" fill="white" />
                                <path d="M556 164.003V232.003H569.2H582.533L582.933 227.069L583.333 222.136L587.2 225.736C592.267 230.403 603.867 234.669 611.867 234.669C619.867 234.669 632.133 230.536 640 225.203C656.4 214.003 664.667 190.003 659.333 169.336C654.933 152.536 648 143.469 633.867 136.536C617.867 128.536 602.533 128.669 590.533 136.803C586.8 139.336 583.467 141.336 583.2 141.336C582.933 141.336 582.667 131.069 582.667 118.669V96.0028H569.333H556V164.003ZM619.733 157.203C629.333 162.136 634.667 171.336 634.667 182.936C634.667 196.269 626.533 206.669 614 209.469C603.2 211.869 595.6 209.736 589.067 202.536C586.267 199.469 584 195.869 584 194.536C584 193.203 583.467 191.736 582.667 191.336C580.4 189.869 581.2 176.669 583.867 170.269C588.4 159.603 595.867 154.803 607.733 154.669C612.133 154.669 616.667 155.603 619.733 157.203Z" fill="white" />
                                <path d="M385.333 144.669C385.333 194.136 385.067 196.403 379.467 202.136C370.8 210.669 355.067 209.603 344.4 199.736C342.8 198.269 340.933 197.203 340.267 197.469C339.6 197.736 335.6 202.136 331.467 207.203L323.867 216.403L327.6 220.403C343.067 236.536 373.733 239.469 392.933 226.403C400.533 221.336 407.333 212.936 410.133 205.469C412.133 200.136 412.533 192.403 413.067 148.269L413.6 97.3361H399.467H385.333V144.669Z" fill="white" />
                                <path d="M680 164.669V232.003H694H708V164.669V97.3361H694H680V164.669Z" fill="white" />
                                <path d="M472.933 132.003C456.133 136.269 441.6 149.203 435.6 165.336C432.533 173.736 432.533 192.003 435.733 200.003C440.933 213.203 448.667 222.269 459.6 227.736C482.533 239.336 505.333 235.869 523.467 218.003C530.267 211.203 532 208.669 534.4 200.803C543.333 172.403 532.4 147.203 505.867 135.069C497.2 131.203 482.133 129.736 472.933 132.003ZM497.333 157.336C510.667 164.136 515.467 182.536 507.867 197.603C502.8 207.469 489.733 212.669 478 209.336C460.267 204.403 453.333 181.869 464.4 165.203C470.8 155.603 486.533 151.869 497.333 157.336Z" fill="white" />
                                <path d="M782 131.869C775.467 133.469 769.6 137.069 764.267 142.669C761.6 145.603 758.933 148.003 758.4 148.003C757.733 148.003 757.333 144.403 757.333 140.003V132.003H744H730.667V182.003V232.003H744H757.333V204.003C757.333 173.069 757.6 171.603 765.867 162.936C771.733 156.669 776.133 154.669 784.533 154.669C790.8 154.669 792.267 155.203 795.733 158.536C800.933 163.736 801.333 167.069 801.333 202.269V232.003H815.333H829.333V205.603C829.333 163.869 827.2 153.203 816.533 141.336C808.8 132.803 794.533 128.803 782 131.869Z" fill="white" />
                            </svg>
                        </Link>
                        <nav className="hidden md:flex ml-10 space-x-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item.href)}
                                    className="text-white/90 hover:text-white font-medium transition-colors duration-300 relative group cursor-pointer"
                                >
                                    {item.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/login"
                            className="text-white/90 hover:text-white font-medium transition-colors duration-300 relative group"
                        >
                            Entrar
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link
                            href="/cadAlunos"
                            className="bg-white text-[#7B2D26] px-6 py-2 rounded-full hover:bg-white/90 font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            Cadastrar-se
                        </Link>
                    </div>

                    <button
                        className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden bg-[#7B2D26]`}>
                    <nav className="py-4 space-y-4">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className="block text-white/90 hover:text-white font-medium transition-colors duration-300 cursor-pointer px-4"
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="pt-4 space-y-3 px-4">
                            <Link
                                href="/login"
                                className="block text-white/90 hover:text-white font-medium transition-colors duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Entrar
                            </Link>
                            <Link
                                href="/cadAlunos"
                                className="block text-white/90 hover:text-white font-medium transition-colors duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sou Aluno
                            </Link>
                            <Link
                                href="/cadEmpresas"
                                className="block text-white/90 hover:text-white font-medium transition-colors duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sou Empresa
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
