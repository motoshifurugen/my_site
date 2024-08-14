import React from 'react'

interface PageFaceProps {
  title: string
  subtitle: string
  mainMessage: React.ReactNode
}

const PageFace: React.FC<PageFaceProps> = ({
  title,
  subtitle,
  mainMessage,
}) => {
  return (
    <>
      <div className="md:flex">
        <div className="w-full md:w-1/2">
          <h1>{title}</h1>
          <h3 className="mt-5">{subtitle}</h3>
        </div>
        <div className="flex w-full md:w-1/2 md:justify-center mt-10 md:mt-0">
          {mainMessage}
        </div>
      </div>
    </>
  )
}

export default PageFace
