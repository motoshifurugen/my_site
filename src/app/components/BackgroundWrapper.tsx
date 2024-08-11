"use client";

import { usePathname } from 'next/navigation';
import React from 'react';
import nextConfig from "../../../next.config.mjs";
const BASE_PATH = nextConfig.basePath || "";

const BackgroundWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isRootPath = pathname === `${BASE_PATH}/` || pathname === "/";

  return (
    <div className="relative min-h-screen">
      {isRootPath && (
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 h-screen animate-fade-in" style={{ backgroundImage: "url('/images/back-pic/day_01.jpg')" }}></div>
      )}
      <div className={`${isRootPath ? 'relative z-10' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;
