import React from 'react';
import { Link } from 'react-router-dom';

export default function Summerhouse() {
  return (
    <main className="font-sans text-white bg-black min-h-screen">
      {/* Hero Section */}
      <section className="max-w-[1280px] mx-auto px-[20px] md:px-[64px] pt-[120px] pb-24 transition-all duration-1000 opacity-100 translate-y-0">
        <Link to="/work" className="inline-flex items-center gap-2 text-[12px] leading-[16px] tracking-[0.1em] font-[600] text-white/60 mb-12 hover:text-white transition-colors uppercase">
          {'<- Back to Work'}
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px] items-center">
          <div className="md:col-span-4 flex flex-col items-start">
            <h1 className="text-[72px] leading-[70px] tracking-[-0.04em] font-[800] md:text-[120px] md:leading-[110px] text-white">07</h1>
            <h2 className="text-[32px] leading-[40px] font-[700] md:text-[48px] md:leading-[56px] text-white -mt-4">Summerhouse</h2>
          </div>
          <div className="md:col-span-8">
            <p className="text-[18px] leading-[160%] font-[400] text-white/80">
              <strong className="text-white">Summerhouse</strong> is a premier villa management company established in 2018. Currently manage a portfolio of approximately 50 villas, mostly in the Canggu area, as well as properties in Ubud, Legian, and Kerobokan.
            </p>
          </div>
        </div>
        {/* Full-width Hero Image */}
        <div className="mt-24 w-full h-[600px] overflow-hidden rounded-lg group">
          <img alt="Pertamina Bali Station" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105" src="/img/work client/summer house/24-5 Feed1.png" onError={(e) => { e.target.src = '/img/pertamina.webp' }} />
        </div>
      </section>

      {/* Project Goal Section */}
      <section className="bg-black py-[120px] transition-all duration-1000 opacity-100 translate-y-0">
        <div className="max-w-[1280px] mx-auto px-[20px] md:px-[64px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px]">
            <div className="md:col-span-10 md:col-start-2">
              <h3 className="text-[12px] leading-[16px] tracking-[0.1em] font-[600] text-white/60 mb-8 uppercase">TRANSFORM</h3>
              <p className="text-[32px] leading-[40px] font-[700] md:text-[48px] md:leading-[56px] text-white leading-tight">
                Build a stronger digital presence through content that highlights both hospitality experiences and visually appealing property management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Points & Staff Image */}
      <section className="max-w-[1280px] mx-auto px-[20px] md:px-[64px] py-[120px] transition-all duration-1000 opacity-100 translate-y-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px] items-center">
          <div className="md:col-span-6">
            <h3 className="text-[12px] leading-[16px] tracking-[0.1em] font-[600] text-white/60 mb-12 uppercase">FOCUS ON</h3>
            <ul className="space-y-8">
              <li className="flex items-start gap-4 group">
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 group-hover:scale-150 transition-transform"></span>
                <span className="text-[24px] leading-[32px] font-[700] text-white opacity-80 group-hover:opacity-100 transition-opacity">Increasing bookings through strategic social media campaigns</span>
              </li>
              <li className="flex items-start gap-4 group">
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 group-hover:scale-150 transition-transform"></span>
                <span className="text-[24px] leading-[32px] font-[700] text-white opacity-80 group-hover:opacity-100 transition-opacity">Showcasing villas with visually engaging and premium content</span>
              </li>
              <li className="flex items-start gap-4 group">
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 group-hover:scale-150 transition-transform"></span>
                <span className="text-[24px] leading-[32px] font-[700] text-white opacity-80 group-hover:opacity-100 transition-opacity">Building trust through consistent lifestyle and experience storytelling</span>
              </li>
              <li className="flex items-start gap-4 group">
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 group-hover:scale-150 transition-transform"></span>
                <span className="text-[24px] leading-[32px] font-[700] text-white opacity-80 group-hover:opacity-100 transition-opacity">Attracting villa owners looking for aesthetic-driven management services</span>
              </li>
            </ul>
          </div>
          <div className="md:col-span-5 md:col-start-8 mt-12 md:mt-0">
            <div className="aspect-[4/5] rounded-lg overflow-hidden border border-white/10">
              <img alt="Pertamina Staff" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" src="/img/work client/summer house/25-2 Feed1.png" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Showcase Grid */}
      <section className="bg-black py-[120px] transition-all duration-1000 opacity-100 translate-y-0">
        <div className="max-w-[1280px] mx-auto px-[20px] md:px-[64px]">
          <div className="mb-16">
            <h3 className="text-[12px] leading-[16px] tracking-[0.1em] font-[600] text-white/60 uppercase tracking-widest">Digital Content Portfolio</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Post 1 */}
            <div className="aspect-square bg-white/5 rounded-lg overflow-hidden group relative border border-white/10">
              <img alt="Premium Villas" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" src="/img/work client/summer house/3-4 Feed5.png" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-[12px] leading-[16px] tracking-[0.1em] font-[600] text-white uppercase">EXCLUSIVE PROPERTIES</p>
              </div>
            </div>
            {/* Post 2 */}
            <div className="aspect-square bg-white/5 rounded-lg overflow-hidden group relative border border-white/10">
              <img alt="Modern Design" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" src="/img/work client/summer house/6-6 Feed1.png" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-[12px] leading-[16px] tracking-[0.1em] font-[600] text-white uppercase">TROPICAL LIVING</p>
              </div>
            </div>
            {/* Post 3 */}
            <div className="aspect-square bg-white/5 rounded-lg overflow-hidden group relative border border-white/10">
              <img alt="Calm Spaces" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" src="/img/work client/summer house/8-5 Feed1.png" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-[12px] leading-[16px] tracking-[0.1em] font-[600] text-white uppercase">RELAXING ENVIRONMENT</p>
              </div>
            </div>
            {/* Post 4 */}
            <div className="aspect-square bg-white/5 rounded-lg overflow-hidden group relative border border-white/10">
              <img alt="Villa Management" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" src="/img/work client/summer house/24-5 Feed1.png" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-[12px] leading-[16px] tracking-[0.1em] font-[600] text-white uppercase">PROFESSIONAL SERVICE</p>
              </div>
            </div>
            {/* Post 5 */}
            <div className="aspect-square bg-white/5 rounded-lg overflow-hidden group relative border border-white/10">
              <img alt="Guest Experience" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" src="/img/work client/summer house/25-2 Feed1.png" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-[12px] leading-[16px] tracking-[0.1em] font-[600] text-white uppercase">5-STAR HOSPITALITY</p>
              </div>
            </div>
            {/* Post 6 */}
            <div className="aspect-square bg-white/5 rounded-lg overflow-hidden group relative border border-white/10">
              <img alt="Investment Property" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" src="/img/work client/summer house/3-4 Feed5.png" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-[12px] leading-[16px] tracking-[0.1em] font-[600] text-white uppercase">BALI REAL ESTATE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="max-w-[1280px] mx-auto px-[20px] md:px-[64px] py-[120px] text-center transition-all duration-1000 opacity-100 translate-y-0">
        <div className="max-w-3xl mx-auto">
          <p className="text-[24px] leading-[32px] font-[700] text-white/80 leading-relaxed">
            Through creative visuals and strategic content, the brand continues to strengthen its positioning as a modern villa management company and connects with both travelers and property owners.
          </p>
        </div>
      </section>
    </main>
  );
}
