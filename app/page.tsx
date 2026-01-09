"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { CarSelector } from "./components/landing/CarSelector";
import { CharacterInput } from "./components/landing/CharacterInput";

interface Character {
  id: number;
  name: string;
  role: string;
}

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([
    { id: 1, name: "", role: "" },
    { id: 2, name: "", role: "" },
    { id: 3, name: "", role: "" },
  ]);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);

  const handleCharacterChange = (id: number, field: "name" | "role", value: string) => {
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === id ? { ...char, [field]: value } : char
      )
    );
  };

  const addCharacter = () => {
    if (characters.length < 6) {
      setCharacters((prev) => [
        ...prev,
        { id: Math.max(...prev.map((c) => c.id), 0) + 1, name: "", role: "" },
      ]);
    }
  };

  return (
    <main className="h-screen overflow-y-auto md:h-auto md:overflow-visible snap-y snap-mandatory scroll-smooth relative w-full overflow-x-hidden flex flex-col items-center">
      {/* Desktop Background - Fixed */}
      <div className="fixed inset-0 -z-20 bg-[#6b26ff] hidden md:flex items-center justify-center">
        <div className="relative w-full h-full max-w-[1920px]">
          <Image
            src="/images/backgrounds/landing-desktop.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
            quality={100}
            sizes="100vw"
          />
        </div>
      </div>

      {/* SECTION 1: Header (Mobile: Screen 1, Desktop: Top) */}
      <section className="snap-start w-full relative flex flex-col items-center justify-center p-4 h-[100dvh] md:h-auto md:max-w-7xl md:pt-10 shrink-0">
        {/* Mobile Background 1 */}
        <div className="absolute inset-0 -z-10 md:hidden">
          <Image
            src="/images/backgrounds/landing-mobile2.jpg"
            alt="Background Mobile 1"
            fill
            className="object-cover object-bottom"
            priority
            quality={100}
            sizes="100vw"
          />
          {/* Gradient Overlay at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        </div>

        {/* Logo and Title */}
        <div className="flex flex-col items-center animate-fade-in-down mb-4 md:mb-8 z-10">
          <div className="relative w-64 h-32 md:w-80 md:h-40">
            <Image
              src="/images/ui/title.png"
              alt="Cuento Kilometros"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 90vw, 50vw"
            />
          </div>
          <div className="relative w-12 h-12 md:w-12 md:h-12 -mt-4 md:-mt-4">
            <Image
              src="/images/ui/renault-logo.svg"
              alt="Renault"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Lorem Ipsum */}
        <p className="text-white text-center text-sm md:hidden max-w-sm drop-shadow-md px-4 font-medium mb-12 z-10">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.
        </p>

        {/* Scroll Indicator (Optional but helpful for sliding hint) */}
        <div className="absolute bottom-8 animate-bounce md:hidden z-10 text-white/70">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5" /></svg>
        </div>

      </section>

      {/* SECTION 2: Form (Mobile: Screen 2, Desktop: Main) */}
      <section className="snap-start w-full relative flex flex-col items-center p-4 min-h-[100dvh] md:min-h-0 md:h-auto md:max-w-7xl md:pb-10 shrink-0">
        {/* Mobile Background 2 */}
        <div className="absolute inset-0 -z-10 md:hidden">
          <Image
            src="/images/backgrounds/landing-mobile1.jpg"
            alt="Background Mobile 2"
            fill
            className="object-cover"
            priority
            quality={100}
            sizes="100vw"
          />
          {/* Gradient Overlay at Top to match previous bottom if needed, usually just darkness is fine */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* Characters Grid */}
        <div className="w-full flex flex-col md:flex-row items-center md:items-start md:justify-center gap-8 max-w-6xl mt-8 md:mt-0 z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 w-full justify-items-center">
            {characters.map((char, index) => (
              <CharacterInput
                key={char.id}
                {...char}
                index={index}
                onChange={handleCharacterChange}
              />
            ))}
          </div>

          {/* Buttons Row/Column */}
          <div className="flex flex-row items-center justify-center md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-6">
            {characters.length < 6 && (
              <button
                onClick={addCharacter}
                className="flex items-center justify-center gap-2 bg-[var(--color-brand-pink,#E91E63)] text-white px-5 py-2 rounded-full font-medium text-sm shadow-lg hover:bg-pink-600 transition-colors transform hover:scale-105 active:scale-95 w-auto md:w-full min-w-[140px]"
              >
                <Plus size={16} />
                Agregar
              </button>
            )}

            {characters.length > 1 && (
              <button
                onClick={() => setCharacters(prev => prev.slice(0, -1))}
                className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full font-medium text-sm transition-colors border border-white/40 w-auto md:w-full min-w-[140px]"
              >
                Eliminar último
              </button>
            )}
          </div>
        </div>

        {/* Car Selector */}
        <div className="z-10 w-full flex justify-center">
          <CarSelector selectedCar={selectedCar} onSelect={setSelectedCar} />
        </div>

        {/* CTA Button */}
        <div className="mt-4 md:mt-8 pb-10 md:pb-0 z-10">
          <button
            className="bg-[var(--color-brand-pink,#E91E63)] text-white text-base md:text-lg px-10 py-3 rounded-full font-medium shadow-xl hover:bg-pink-600 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedCar || characters.some(c => !c.name || !c.role)}
          >
            Crear cuento
          </button>
        </div>
      </section>
    </main>
  );
}

