import PropTypes from 'prop-types';

const BrandsStrip = ({ products }) => {
  const brands = Array.from(new Set(products.map((product) => product.brand))).slice(0, 10);
  const track = [...brands, ...brands];

  return (
    <section className="py-10 bg-white brand-font">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Marcas que confias</h2>
        </div>
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-gray-50">
          <div className="marquee-track flex items-center gap-6 py-6 px-6">
            {track.map((brand, index) => (
              <div
                key={`${brand}-${index}`}
                className="min-w-[150px] px-4 py-3 rounded-2xl bg-white text-gray-700 text-sm font-semibold shadow-sm border border-gray-100"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandsStrip;

BrandsStrip.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    brand: PropTypes.string,
  })).isRequired,
};
