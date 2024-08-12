"use client";

import React from 'react';
import AnimatedLine from './AnimatedLine';

interface PageFaceProps {
  title: string;
  subtitle: string;
  mainMessage: React.ReactNode;
}

const PageFace: React.FC<PageFaceProps> = ({ title, subtitle, mainMessage }) => {
  return (
    <>
      <div className="md:flex mb-5 md:mb-20 px-6 md:px-20">
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          <h2 className="text-lg md:text-2xl font-bold mt-5">{subtitle}</h2>
        </div>
        <div className="flex justify-left w-full md:w-1/2 mt-10 md:mt-0">
          {mainMessage}
        </div>
      </div>
      <div className="mb-10 md:mb-24">
        <AnimatedLine />
      </div>
    </>
  );
};

export default PageFace;
