"use client";

import SearchHeader from "@/components/home/SearchHeader";

export default function HomePage() {
  return (
    <main className="w-full min-h-screen">

      <SearchHeader />

      <div className="w-full max-w-[1400px] mx-auto bg-white text-black rounded-t-3xl shadow-lg p-8 mt-6">
        <h1 className="text-2xl font-bold text-[#0091FF]">
          Bem-vindo ao sistema Tureggon
        </h1>
        <p className="text-gray-600 mt-2">
          Segunda parte igual à Lasy, onde entram cards e informações.
        </p>
      </div>

    </main>
  );
}
