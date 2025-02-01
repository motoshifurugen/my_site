import React, { useEffect, useState } from 'react'

interface LoadingCircleProps {
  isLoading: boolean
}

const LoadingCircle: React.FC<LoadingCircleProps> = ({ isLoading }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 1000) // フェードアウトの時間と一致させる
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    isVisible && (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-main-white transition-opacity duration-1000 dark:bg-night-black ${isLoading ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="relative flex items-center justify-center">
          <div className="circle block dark:hidden"></div>
          <div className="night-circle hidden dark:block"></div>
          <div className="seagull seagull-1">
            <div className="wing left-wing"></div>
            <div className="wing right-wing"></div>
          </div>
          <div className="seagull seagull-2">
            <div className="wing left-wing"></div>
            <div className="wing right-wing"></div>
          </div>
        </div>
        <style jsx>{`
          .circle {
            position: absolute;
            width: 100px;
            height: 100px;
            background: #86b3e0;
            border-radius: 50%;
            animation: grow 2s infinite ease-in-out;
          }
          .night-circle {
            position: absolute;
            width: 100px;
            height: 100px;
            background: #f4d06f;
            border-radius: 50%;
            animation: grow 2s infinite ease-in-out;
          }

          @keyframes grow {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.5);
            }
            100% {
              transform: scale(1);
            }
          }

          .seagull {
            position: relative;
            width: 60px;
            height: 30px;
          }

          .seagull-1 {
            transform: translate(-10px, -10px) rotate(-10deg);
          }

          .seagull-2 {
            transform: translate(20px, 20px) rotate(-10deg);
          }

          .wing {
            position: absolute;
            width: 30px;
            height: 8px;
            background: #4a4a4a;
            border-radius: 90% 90% 0 0;
            animation: flap 0.6s infinite ease-in-out;
          }

          .left-wing {
            transform-origin: right bottom;
            left: 0;
            animation-delay: 0s;
          }

          .right-wing {
            transform-origin: left bottom;
            right: 0;
            animation-delay: 0.3s;
          }

          @keyframes flap {
            0%,
            100% {
              transform: rotate(0deg) scaleY(1);
            }
            50% {
              transform: rotate(-20deg) scaleY(1.1);
            }
          }
        `}</style>
      </div>
    )
  )
}

export default LoadingCircle
