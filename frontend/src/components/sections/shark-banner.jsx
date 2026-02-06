import React from 'react';
import Image from 'next/image';
import { Zap } from 'lucide-react';

/**
 * SharkBanner Component
 * 
 * Clones the "As seen on ST2" announcement bar with the animated shark GIF.
 * Updated to match the new blue theme colors instead of the original yellow background.
 * Primary color: #0056D2 (Primary blue from design system)
 */
const SharkBanner = () => {
  return (
    <div className="w-full bg-[#0056D2] overflow-hidden">
      <div className="container mx-auto px-4 py-2 sm:py-3 h-[60px] sm:h-[70px] flex items-center justify-center">
        <div className="flex items-center justify-center gap-2 sm:gap-4 h-full">
          {/* Main Text Content */}
          <div className="flex items-center">
            <a
              href="https://www.instagram.com/reel/Cn9kt9OLaj-/?igshid=YmMyMTA2M2Y%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-sans text-base sm:text-lg lg:text-xl font-medium tracking-tight whitespace-nowrap hover:opacity-90 transition-opacity"
            >
              <span className="opacity-95">As</span> seen on{' '}
              <span className="font-extrabold tracking-normal">ST2</span>
            </a>
          </div>

          {/* Animated Shark GIF */}
          <div className="relative flex items-center cursor-pointer h-full" onClick={() => window.open('https://youtu.be/gaDsZMDG95Q?si=9OOftQSiBptVEBYz', '_blank')}>
            <div className="relative h-[45px] sm:h-[55px] w-[50px] sm:w-[60px]">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/shark-2.gif"
                alt="Shark Tank Animation"
                fill
                className="object-contain"
                priority
                unoptimized // GIFs need to be unoptimized in Next.js Image for animation to work reliably
              />
            </div>
          </div>
        </div>
      </div>

      {/* Styled text decoration/link for the secondary notification bar often seen below */}
      <div className="w-full bg-[#003D99] py-1 text-center">
        <a
          href="/services"
          className="inline-flex items-center gap-2 text-white font-sans text-[11px] sm:text-[13px] font-semibold tracking-wide uppercase"
        >
          <Zap size={14} className="text-yellow-300 fill-yellow-300" />
          Get a maid in 15 mins
          <Zap size={14} className="text-yellow-300 fill-yellow-300" />
        </a>
      </div>

      <style jsx global>{`
        .shark-container {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--color-primary);
        }
        
        .shark-content a {
          color: white;
          text-decoration: none;
          font-family: var(--font-sans);
        }

        #bold {
          font-weight: 800;
        }
      `}</style>
    </div>
  );
};

export default SharkBanner;