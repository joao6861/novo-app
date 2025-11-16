export default function AvaliacoesPage() {
  const reviews = [
    { user: "Carlos Souza", rating: 5, text: "Sistema excelente!" },
    { user: "Marcos", rating: 4, text: "Ótimas informações." },
  ];

  return (
    <div className="min-h-screen bg-[#001428] text-white p-6">
      <h1 className="text-3xl font-bold text-center">Avaliações</h1>

      <div className="max-w-2xl mx-auto mt-6 space-y-4">
        {reviews.map((r, i) => (
          <div key={i} className="p-4 bg-white/10 rounded-xl">
            <h3 className="font-bold">{r.user}</h3>
            <p>⭐ {r.rating}</p>
            <p className="text-white/70 mt-2">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
