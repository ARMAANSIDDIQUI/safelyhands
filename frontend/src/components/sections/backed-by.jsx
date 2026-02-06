import Image from "next/image";

/**
 * BackedBy component clones the logo wall section of investors and partners.
 * It uses the provided SVG assets and follows the high-level design system.
 */
export default function BackedBy() {
  const partners = [
    {
      name: "Magic Fund",
      src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/MagicFund-4.svg",
      width: 120,
      height: 48,
    },
    {
      name: "2am VC",
      src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/2amVC-5.svg",
      width: 45,
      height: 40,
    },
    {
      name: "SAT",
      src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/SAT-6.svg",
      width: 90,
      height: 40,
    },
    {
      name: "100x",
      src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/100x-7.svg",
      width: 90,
      height: 40,
    },
    {
      name: "Dholakia Ventures",
      src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/Dholakia-8.svg",
      width: 140,
      height: 40,
    },
    {
      name: "Riverside Ventures",
      src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/Riverside-21.png",
      width: 80,
      height: 40,
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container px-4 mx-auto text-center">
        {/* Section Heading */}
        <h3 
          className="text-[14px] font-semibold text-[#666666] mb-8 uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Backed By
        </h3>

        {/* Logo Wall */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-80 hover:opacity-100 transition-opacity duration-300">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
            >
              <Image
                src={partner.src}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className="object-contain max-h-[40px] w-auto"
                unoptimized // Using unoptimized for SVGs and external Supabase links to ensure they load as intended
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}