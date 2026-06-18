import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { works } from '../data/works';
import Pertamina from './clients/Pertamina';
import YamahaBali from './clients/YamahaBali';
import HotStone from './clients/HotStone';
import TheSmokeHouse from './clients/TheSmokeHouse';
import TanukiSushiBar from './clients/TanukiSushiBar';
import Mallali from './clients/Mallali';
import Summerhouse from './clients/Summerhouse';
import Samaya from './clients/Samaya';
import SurfAndBrew from './clients/SurfAndBrew';
import BlueMarlinKomodo from './clients/BlueMarlinKomodo';

function WorkDetail() {
  const { slug } = useParams();
  const work = works.find((item) => item.slug === slug);

  if (!work) {
    return (
      <section className="min-h-screen bg-black text-white px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Link to="/work" className="inline-flex items-center text-white/80 hover:text-white">
            {'<- Back to Works'}
          </Link>
          <h1 className="mt-8 text-3xl md:text-5xl font-semibold">Work Not Found</h1>
          <p className="mt-4 text-white/70">We could not find that project.</p>
        </div>
      </section>
    );
  }

  if (slug === 'pertamina') return <Pertamina />;
  if (slug === 'yamaha-bali') return <YamahaBali />;
  if (slug === 'hot-stone') return <HotStone />;
  if (slug === 'the-smoke-house') return <TheSmokeHouse />;
  if (slug === 'tanuki-sushi-bar') return <TanukiSushiBar />;
  if (slug === 'mallali') return <Mallali />;
  if (slug === 'summerhouse') return <Summerhouse />;
  if (slug === 'samaya') return <Samaya />;
  if (slug === 'surf-and-brew') return <SurfAndBrew />;
  if (slug === 'blue-marlin-komodo') return <BlueMarlinKomodo />;

  return (
    <section className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <Link to="/work" className="inline-flex items-center text-white/80 hover:text-white">
          {'<- Back to Works'}
        </Link>

        <div className="mt-10">
          <div className="text-white/50 text-sm tracking-widest">{work.number}</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold">{work.title}</h1>
          <p className="mt-6 text-white/70 leading-relaxed">{work.description}</p>
        </div>

        {work.imgs && work.imgs.length > 0 && (
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {work.imgs.map((imgSrc, index) => (
              <img key={index} src={imgSrc} alt={`${work.title} Detail ${index + 1}`} className="object-cover rounded-xl bg-white/5 w-full h-48 md:h-64" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default WorkDetail;
