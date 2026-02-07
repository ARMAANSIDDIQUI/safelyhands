import React from 'react';
import { Quote } from 'lucide-react';

/**
 * MissionSection component
 * Cloned based on the design requirements and visual references.
 * Centered "Our Mission" heading with a blockquote-style mission statement
 * enclosed in iconic yellow quotation marks.
 */
const MissionSection = () => {
  return (
    <>
      {/* Decorative separators (dots) as per the HTML structure "radio-sec" */}
      <div className="container-fluid pt-[16px] pb-[16px]">
        <div className="container mx-auto">
          <div className="flex justify-center gap-[10px]">
            <div className="w-[8px] h-[8px] rounded-full bg-[#72bcd4]"></div>
            <div className="w-[8px] h-[8px] rounded-full bg-[#72bcd4]"></div>
            <div className="w-[8px] h-[8px] rounded-full bg-[#72bcd4]"></div>
          </div>
        </div>
      </div>

      <section className="bg-transparent py-[80px] overflow-hidden">
        <div className="container mx-auto px-[15px] max-w-[1200px]">
          <div className="text-center">
            {/* "Our Mission" Heading */}
            <h2 className="font-display text-[24px] sm:text-[32px] font-semibold text-[#212529] mb-[40px]">
              Our Mission
            </h2>

            {/* Mission Statement Container */}
            <div className="relative max-w-[900px] mx-auto px-[40px] sm:px-[60px]">
              {/* Top-Left Yellow Quotation Mark */}
              <div className="absolute top-0 left-0 -translate-y-1/2 sm:translate-x-0">
                <Quote size={40} className="text-primary opacity-40 rotate-180" />
              </div>

              {/* Mission Text */}
              <p className="font-display text-[18px] sm:text-[22px] leading-[1.6] text-[#6c757d] font-normal italic">
                SAFELY HANDS is enabling customers to hire experienced, verified and reliable professionals.
              </p>

              {/* Bottom-Right Yellow Quotation Mark (rotated for closing effect) */}
              <div className="absolute bottom-0 right-0 translate-y-1/2">
                <Quote size={40} className="text-primary opacity-40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative separators (dots) as per the HTML structure "radio-sec2" */}
      <div className="container-fluid py-[16px]">
        <div className="container mx-auto">
          <div className="flex justify-center gap-[10px]">
            <div className="w-[8px] h-[8px] rounded-full bg-[#72bcd4]"></div>
            <div className="w-[8px] h-[8px] rounded-full bg-[#72bcd4]"></div>
            <div className="w-[8px] h-[8px] rounded-full bg-[#72bcd4]"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MissionSection;