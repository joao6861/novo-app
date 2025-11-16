export default function VeiculosPage() {
  const categories = ["Carros", "Motos", "SUVs", "Utilitários"];

  return (
    <div className="min-h-screen bg-[#001428] text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Catálogo de Veículos
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto">
        {categories.map((c) => (
          <div
            key={c}
            className="p-6 bg-white/10 border border-white/20 rounded-xl text-center cursor-pointer hover:bg-white/20"
          >
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}
