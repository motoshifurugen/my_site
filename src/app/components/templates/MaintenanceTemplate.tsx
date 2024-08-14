import React from 'react';
import PageFace from '../organism/PageFace';
import AnimatedLine from '../atoms/AnimatedLine';
import Image from 'next/image';

interface MaintenanceTemplateProps {
  title: string;
  imagePath: string;
}

const MaintenanceTemplate: React.FC<MaintenanceTemplateProps> = ({ title, imagePath }) => {
  return (
    <>
      <section>
        <PageFace
          title={title}
          subtitle=""
          mainMessage={<></>}
        />
      </section>

      <AnimatedLine />

      <section>
        <div className="flex w-full justify-center">
          <Image src={imagePath} alt="coming soon" width={500} height={500} className="rounded-2xl" />
        </div>
      </section>
    </>
  );
};

export default MaintenanceTemplate;
