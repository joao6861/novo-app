export default function HeroSection() {
  return (
    <section className="w-full text-center py-20 bg-gradient-to-b from-[#001226] to-[#000915] text-white">
      <button className="px-4 py-2 bg-[#00BFFF]/20 text-[#00BFFF] rounded-full border border-[#00BFFF] mb-6">
        ⚡ Consulta Veicular Inteligente
      </button>

      <h1 className="text-4xl md:text-6xl font-bold">
        Descubra Tudo Sobre <br />
        <span className="text-[#7AB7FF]">Seu Veículo</span>
      </h1>

      <p className="mt-6 text-gray-300 text-lg max-w-2xl mx-auto">
        Consulta completa de dados veiculares, especificações técnicas e informações
        de manutenção em segundos.
      </p>
    </section>
  );
}
