"use client";

import React, { useEffect, useRef } from 'react';

interface PageFaceProps {
  title: string;
  subtitle: string;
  mainMessage: React.ReactNode;
}

const PageFace: React.FC<PageFaceProps> = ({ title, subtitle, mainMessage }) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.classList.remove('w-0');
      lineRef.current.classList.add('w-full');
    }
  }, []);

  return (
    <>
      <div className="flex mb-20 px-20">
        <div className="w-1/2">
          <h1 className="text-4xl font-bold">{title}</h1>
          <h2 className="text-2xl font-bold mt-5">{subtitle}</h2>
        </div>
        <div className="flex justify-left w-1/2">
          {mainMessage}
        </div>
      </div>
      <div
        ref={lineRef}
        className="h-0.5 opacity-50 bg-font-main transition-all duration-1000 ease-in-out w-0 mt-4 mb-24"
      ></div>
    </>
  );
};

export default PageFace;
