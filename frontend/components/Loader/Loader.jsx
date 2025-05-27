'use client';

import React from 'react';
import Image from 'next/image';

export default function Loader({ fullScreen = true }) {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'fixed inset-0 z-50' : 'py-10'} bg-white/95 backdrop-blur-sm`}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%237B2D26' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="relative w-28 h-28 mb-8">
        {/* Elegant ring animation */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 border-2 border-[#7B2D26]/10 rounded-full"></div>
          <div className="absolute inset-0 border-t-2 border-[#7B2D26] rounded-full animate-[spin_2s_linear_infinite]"></div>
        </div>
        
        {/* Logo container with subtle shadow */}
        <div className="absolute inset-4 flex items-center justify-center">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-[#7B2D26]/5 rounded-full blur-sm"></div>
            <div className="relative z-10 flex items-center justify-center w-full h-full">
              <Image 
                src="/img/global/logo_icon.svg" 
                alt="JobIn" 
                width={64} 
                height={64}
                className="opacity-90"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Minimal progress indicator */}
      <div className="w-40 h-[2px] bg-gray-100 overflow-hidden">
        <div className="h-full bg-[#7B2D26] rounded-full animate-loadingBar"></div>
      </div>
      
      <p className="mt-6 text-[#7B2D26]/80 font-medium text-sm tracking-wider">CARREGANDO<span className="animate-[dots_1.5s_infinite]">...</span></p>
    </div>
  );
}