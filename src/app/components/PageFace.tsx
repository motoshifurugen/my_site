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
      <div className="flex mb-20 px-20">
        <div className="w-1/2">
          <h1 className="text-4xl font-bold">{title}</h1>
          <h2 className="text-2xl font-bold mt-5">{subtitle}</h2>
        </div>
        <div className="flex justify-left w-1/2">
          {mainMessage}
        </div>
      </div>
      <div className="mb-24">
        <AnimatedLine />
      </div>
    </>
  );
};

export default PageFace;
