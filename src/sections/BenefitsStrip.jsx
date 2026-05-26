const benefits = [
  {
    title: 'Envio express',
    description: 'Entregas en 24h en zonas principales.',
    icon: '🚚'
  },
  {
    title: 'Atencion confiable',
    description: 'Soporte rapido con personal capacitado.',
    icon: '🩺'
  },
  {
    title: 'Pago seguro',
    description: 'Proteccion en todas tus compras.',
    icon: '🔒'
  },
  {
    title: 'Stock garantizado',
    description: 'Productos esenciales siempre disponibles.',
    icon: '✅'
  }
];

const BenefitsStrip = () => {
  return (
    <section className="py-10 bg-white brand-font">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="text-2xl">{benefit.icon}</div>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">{benefit.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsStrip;
