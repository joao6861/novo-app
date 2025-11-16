export default function WhyChooseSection() {
  const items = [
    {
      title: "Base Completa",
      desc: "Milhares de veículos nacionais e importados em nossa base.",
      icon: "🚗",
    },
    {
      title: "Consulta Rápida",
      desc: "Resultados em segundos. Digite a placa e tenha tudo em mãos.",
      icon: "⏱️",
    },
    {
      title: "Dados Seguros",
      desc: "Informações sempre atualizadas e confiáveis.",
      icon: "🛡️",
    },
  ];

  return (
    <section className="bg-[#000915] text-white py-20 px-4">
      <h2 className="text-3xl font-bold text-center">Por que escolher a Tureggon?</h2>
      <p className="mt-3 text-center text-gray-400">
        Tecnologia de ponta para consultas veiculares completas e precisas
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
        {items.map((item) => (
          <div
            key={item.title}
            className="bg-gradient-to-b from-[#001226] to-[#00101A] p-8 rounded-3xl text-center shadow-lg"
          >
            <div className="text-5xl mb-4">{item.icon}</div>
            <h3 className="font-semibold text-xl">{item.title}</h3>
            <p className="text-gray-400 mt-3">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
