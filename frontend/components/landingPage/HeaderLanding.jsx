
import React from 'react';
import Link from 'next/link';

export default function HeaderLanding() {
    return (
        <header id="header" className="bg-white shadow-sm fixed w-full z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                    <img src="./logos/1.png" className="h-[70px] w-[100px] object-contain cursor-pointer " alt="" />
                        <div className="hidden md:flex ml-10 space-x-6">
                            <span className="text-gray-700 hover:text-[#8C1C13] font-medium cursor-pointer">Início</span>
                            <span className="text-gray-700 hover:text-[#8C1C13] font-medium cursor-pointer">Vagas</span>
                            <span className="text-gray-700 hover:text-[#8C1C13] font-medium cursor-pointer">Empresas</span>
                            <span className="text-gray-700 hover:text-[#8C1C13] font-medium cursor-pointer">Sobre</span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <span className="text-gray-700 hover:text-[#8C1C13] cursor-pointer">
                            <i className="text-xl" data-fa-i2svg=""><svg className="svg-inline--fa fa-bell" aria-hidden="true" focusable="false" data-prefix="far" data-icon="bell" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg></i>
                        </span>
                        <span className="text-gray-700 hover:text-[#8C1C13] cursor-pointer">
                            <i className="text-xl" data-fa-i2svg=""><svg className="svg-inline--fa fa-envelope" aria-hidden="true" focusable="false" data-prefix="far" data-icon="envelope" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"></path></svg></i>
                        </span>
                        <div className="relative">

                        </div>
                        <span className="bg-[#8C1C13] text-white px-4 py-2 rounded-full hover:bg-[#6b150e] transition-colors cursor-pointer">
                            Publicar Vaga
                        </span>
                    </div>
                    <button className="md:hidden text-gray-700">
                        <i className="text-xl">
                            <svg className="svg-inline--fa fa-bars" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path fill="currentColor" d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"></path>
                            </svg>
                        </i>
                    </button>
                </div>
            </div>
        </header>
    );
}
