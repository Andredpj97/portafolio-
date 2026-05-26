const categoryImages = {
  Medicamentos: [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?auto=format&fit=crop&w=600&q=80',
  ],
  'Cuidado Personal': [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522337094846-8a818192de1f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  ],
  Suplementos: [
    'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1615485737454-6a2d0f7f0c10?auto=format&fit=crop&w=600&q=80',
  ],
  Higiene: [
    'https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583947215222-0d1b8297a4d7?auto=format&fit=crop&w=600&q=80',
  ],
};

const getFallbackImage = (product) => {
  const images = categoryImages[product.category];
  if (!images || images.length === 0) {
    return 'https://images.unsplash.com/photo-1526366003456-5b7d4df6e92f?auto=format&fit=crop&w=600&q=80';
  }
  const index = Math.abs(product.id) % images.length;
  return images[index];
};

const getProductImage = (product) => {
  if (!product) {
    return 'https://images.unsplash.com/photo-1526366003456-5b7d4df6e92f?auto=format&fit=crop&w=600&q=80';
  }
  if (product.image && product.image !== '/vite.svg') {
    return product.image;
  }
  return getFallbackImage(product);
};

export default getProductImage;
