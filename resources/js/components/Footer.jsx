import React from 'react';

function Footer() {
  return (
    <footer className="bg-black">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Mobile layout */}
        <div className="md:hidden">
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Bali</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Jl. Danau Tamblingan No.226, Sanur, Denpasar Selatan, Kota Denpasar, Bali
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Contact</h4>
              <p className="text-white/70 text-sm">0896-3889-3601 - Felix Marbun</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Email</h4>
              <p className="text-white/70 text-sm">produksitigapagi@gmail.com</p>
            </div>
          </div>

          <div className="mt-10">
            <h4 className="text-sm font-bold text-white mb-4">Our Social Media</h4>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com/studio.tigapagi" target="_blank" rel="noopener noreferrer">
                <img src="/public/img/IG.png" alt="Instagram" className="w-10 h-10" />
              </a>
              <a href="https://tiktok.com/@studio.tigapagi" target="_blank" rel="noopener noreferrer">
                <img src="/public/img/TT.png" alt="TikTok" className="w-10 h-10" />
              </a>
              <a href="https://threads.net/@studio.tigapagi" target="_blank" rel="noopener noreferrer">
                <img src="/public/img/T.png" alt="Threads" className="w-10 h-10" />
              </a>
            </div>
          </div>

          {/* Big tagline */}
          <h2 className="text-4xl font-bold text-white leading-tight mt-12">
            A creative makerspace that consist of passionate nocturnal folks.
          </h2>

          {/* Bottom credits */}
          <div className="mt-10 flex items-center gap-12 text-sm text-white/70">
            <a href="https://instagram.com/dazee._" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Daze</a>
            <a href="https://instagram.com/ag.setiawannn" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Setiawan</a>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:block">
          <div className="flex flex-wrap gap-x-16 gap-y-6 mb-10">
            <div className="max-w-xs">
              <h4 className="text-sm font-bold text-white mb-2">Bali</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Jl. Danau Tamblingan No.226, Sanur, Denpasar Selatan, Kota Denpasar, Bali
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Contact</h4>
              <p className="text-white/70 text-sm">0896-3889-3601 - Felix Marbun</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Email</h4>
              <p className="text-white/70 text-sm">produksitigapagi@gmail.com</p>
            </div>
          </div>

          {/* Social Media */}
          <div className="mb-12">
            <h4 className="text-sm font-bold text-white mb-4">Our Social Media</h4>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com/studio.tigapagi" target="_blank" rel="noopener noreferrer">
                <img src="/public/img/IG.png" alt="Instagram" className="w-11 h-11" />
              </a>
              <a href="https://tiktok.com/@studio.tigapagi" target="_blank" rel="noopener noreferrer">
                <img src="/public/img/TT.png" alt="TikTok" className="w-11 h-11" />
              </a>
              <a href="https://threads.net/@studio.tigapagi" target="_blank" rel="noopener noreferrer">
                <img src="/public/img/T.png" alt="Threads" className="w-11 h-11" />
              </a>
            </div>
          </div>

          {/* Big tagline */}
          <h2 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-10">
            A creative makerspace<br />
            that consist of passionate<br />
            nocturnal folks.
          </h2>

          {/* Bottom credits */}
          <div className="flex items-center gap-12 text-sm text-white/70">
            <a href="https://instagram.com/dazee._" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Daze</a>
            <a href="https://instagram.com/ag.setiawannn" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Setiawan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
