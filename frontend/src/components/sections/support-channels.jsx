import React from 'react';
import Image from 'next/image';

const SupportChannels = () => {
  const contactInfo = [
    {
      label: 'Phone Number',
      value: '+91 8401-8401-42',
      icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/Group_20119-8.svg',
      link: 'tel:+918401840142',
    },
    {
      label: 'E-mail ID',
      value: 'armaansiddiqui.mbd@gmail.com',
      icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/Group_20120-9.svg',
      link: 'mailto:armaansiddiqui.mbd@gmail.com',
    },
    {
      label: 'Whatsapp',
      value: '+91 8401-8401-42',
      icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/Group_20121-10.svg',
      link: 'https://wa.me/918401840142',
    },
  ];

  const appLinks = [
    {
      name: 'App Store',
      img: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/apple-21.svg',
      link: '#',
    },
    {
      name: 'Google Play',
      img: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/playstore-22.svg',
      link: '#',
    },
  ];

  return (

    <section className="w-full bg-transparent font-sans">
      <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-16">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          {/* Contact Details Sidebar */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="flex flex-col gap-8">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-4 group bg-transparent">
                  <div className="w-[50px] h-[50px] flex items-center justify-center bg-[#262626] rounded-xl transition-all duration-300">
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#666666] font-normal leading-tight">
                      {item.label}
                    </span>
                    <a
                      href={item.link}
                      className="text-[20px] font-bold text-[#262626] hover:text-[#72bcd4] transition-colors duration-300"
                    >
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Sub-links */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-4">
              <a href="#" className="text-[14px] text-[#666666] hover:text-[#262626] transition-colors">Terms & Conditions</a>
              <a href="#" className="text-[14px] text-[#666666] hover:text-[#262626] transition-colors">Privacy Policy</a>
              <a href="#" className="text-[14px] text-[#666666] hover:text-[#262626] transition-colors">Refund Policy</a>
            </div>
          </div>

          {/* Illustrative Graphic Area (Empty placeholder to match layout) */}
          <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center">
            <div className="relative w-full max-w-[400px] aspect-square opacity-80">
              {/* SVG from global assets placeholder or visual equivalent would go here */}
              {/* Based on screenshots, there's a multi-layered heart/chat icon graphic */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,_rgba(255,209,46,0.1)_0%,_rgba(255,255,255,0)_70%)] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* App Download Banner */}
        <div className="mt-12 w-full border border-[#72bcd4] rounded-[12px] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
          <h2 className="text-[20px] md:text-[24px] font-bold text-[#262626] text-center md:text-left">
            Download the app and use the LIVE CHAT feature!
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {appLinks.map((app, index) => (
              <a
                key={index}
                href={app.link}
                className="transition-transform duration-300 hover:scale-[1.03]"
              >
                <img
                  src={app.img}
                  alt={app.name}
                  className="h-[48px] md:h-[56px] w-auto bg-black rounded-lg"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportChannels;