export default function HeroSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
      <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/60 text-sm text-cyan-200 mb-2">
        <span className="mr-2">⚡</span> Consulta Veicular Inteligente
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
        Descubra Tudo Sobre
        <br />
        <span className="text-cyan-300">Seu Veículo</span>
      </h1>

      <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto">
        Consulta completa de dados veiculares, especificações técnicas e
        informações de manutenção em segundos.
      </p>
    </section>
  );
}
