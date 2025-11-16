export default function OficinasPage() {
  const offices = [
    {
      name: "Auto Center Premium",
      distance: "2.5 km",
      rating: "4.8",
      image: "/workshop1.jpg",
    },
    {
      name: "Oficina Mecânica Express",
      distance: "3.8 km",
      rating: "4.6",
      image: "/workshop2.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#001428] text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-4">
        Oficinas Próximas
      </h1>

      <p className="text-center text-white/70 mb-8">
        Encontre oficinas de confiança perto de você
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {offices.map((o) => (
          <div
            key={o.name}
            className="bg-white/10 rounded-xl overflow-hidden border border-white/10"
          >
            <img src={o.image} className="w-full h-48 object-cover" />

            <div className="p-4">
              <h2 className="text-xl font-semibold">{o.name}</h2>

              <div className="flex justify-between mt-2">
                <span>📍 {o.distance}</span>
                <span>⭐ {o.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
