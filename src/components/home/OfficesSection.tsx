import offices from "@/lib/offices-data";

export default function OfficesSection() {
  return (
    <section className="bg-[#000915] text-white py-20 px-4">
      <h2 className="text-3xl font-bold text-center">Oficinas Próximas</h2>
      <p className="text-gray-400 text-center mt-2">
        Encontre oficinas de confiança perto de você
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-10 max-w-6xl mx-auto">
        {offices.map((office) => (
          <div
            key={office.id}
            className="bg-gradient-to-b from-[#001226] to-[#000E19] p-4 rounded-3xl shadow-lg"
          >
            <img
              src={office.image}
              className="w-full h-48 object-cover rounded-2xl"
              alt={office.name}
            />

            <div className="flex justify-between px-2 mt-3">
              <span className="text-sm bg-[#00BFFF]/20 text-[#00BFFF] px-3 py-1 rounded-full">
                📍 {office.distance}
              </span>

              <span className="text-sm bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full">
                ⭐ {office.rating}
              </span>
            </div>

            <h3 className="text-xl font-semibold mt-4 px-2">{office.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
