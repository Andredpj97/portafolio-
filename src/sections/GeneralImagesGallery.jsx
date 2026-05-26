import React from 'react';

const generalImages = [
  'images/cuidado-personal/general/1)comprar-en-cafam-jabon-dove-baby-humectacion-sensible-frasco-con-400-ml-precio.jpg',
  'images/cuidado-personal/general/2)comprar-en-cafam-toallitas-humedas-winny-aloe-vera-empaque-con-100-unidades-precio.jpg',
  'images/cuidado-personal/general/3)comprar-en-cafam-jabon-dove-baby-humectacion-sensible-frasco-con-400-ml-precio.jpg',
  'images/cuidado-personal/general/4)comprar-en-cafam-desodorante-rexona-clinical-expert-classic-caja-con-frasco-con-91-ml-precio.jpg',
  'images/cuidado-personal/general/5)comprar-en-cafam-desodorante-rexona-clinical-expert-men-caja-con-frasco-con-91-ml-precio.webp',
  'images/cuidado-personal/general/6)comprar-en-cafam-jabon-liquido-dove-baby-humectacion-enriquecida-frasco-con-400-ml-precio.webp',
  'images/cuidado-personal/general/7)comprar-en-cafam-desodorante-dove-dermoaclarant-2-frascos-con-150-ml-precio.webp',
  'images/cuidado-personal/general/8)comprar-en-cafam-rexona-men-clinical-caja-con-frasco-con-48-g-precio.webp',
  'images/cuidado-personal/general/9)comprar-en-cafam-desodorante-rexona-clinical-women-crema-frasco-con-48-g-precio.webp',
  'images/cuidado-personal/general/10)serum-corporal-dove-niacinamida-400-ml.jpg',
  'images/cuidado-personal/general/11)desodorante-axe-green-gerani-en-aerosol-150-ml.webp',
  'images/cuidado-personal/general/12)comprar-en-cafam-baby-dove-jabon-de-tocador-enriquecida-caja-con-3-jabones-con-75-g-cu-precio.webp',
];

const GeneralImagesGallery = () => (
  <section className="py-10 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Cuidado Personal - General</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {generalImages.map((src, idx) => (
          <div key={idx} className="rounded-lg overflow-hidden shadow hover:scale-105 transition">
            <img src={src} alt={`Cuidado personal general ${idx+1}`} className="w-full h-40 object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default GeneralImagesGallery;
