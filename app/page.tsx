"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { CarSelector } from "./components/landing/CarSelector";
import { CharacterInput } from "./components/landing/CharacterInput";
import styles from "./Home.module.css"; // Asegúrate que la ruta sea correcta

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

  // --- Logic Injection ---
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    | {
      charId: number;
      missingField: "name" | "role";
      currentName: string;
      currentRole: string;
    }[]
    | null
  >(null);

  const handleGenerate = async () => {
    if (!selectedCar) return;

    // Strict Validation: Check for partial characters
    const partialChars = characters.filter(
      (c) => (c.name && !c.role) || (!c.name && c.role)
    );

    if (partialChars.length > 0) {
      setValidationErrors(
        partialChars.map((c) => ({
          charId: c.id,
          missingField: !c.name ? "name" : "role",
          currentName: c.name,
          currentRole: c.role,
        }))
      );
      return;
    }

    if (characters.every((c) => !c.name && !c.role)) {
      alert("Agrega al menos un personaje completo (nombre y rol).");
      return;
    }

    setIsLoading(true);
    setStory("");
    setAudioSrc("");

    try {
      const res = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characters, selectedCar }),
      });

      const data = await res.json();
      if (data.story && data.audio) {
        setStory(data.story);
        // Base64 to Blob
        const byteCharacters = atob(data.audio);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        setAudioSrc(url);
      } else {
        alert("No se pudo generar el cuento.");
      }
    } catch (e) {
      console.error(e);
      alert("Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!email) return;
    setIsSavingEmail(true);
    try {
      await fetch("/api/save-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setShowEmailModal(false);

      // Auto-download Audio and Story
      if (audioSrc) {
        const link = document.createElement("a");
        link.href = audioSrc;
        link.download = "cuento-kilometros.mp3";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      alert("Email guardado y audio descargado!");
    } catch (e) {
      console.error(e);
      alert("Error guardando el email.");
    } finally {
      setIsSavingEmail(false);
    }
  };
  // -----------------------

  const handleCharacterChange = (
    id: number,
    field: "name" | "role",
    value: string
  ) => {
    setCharacters((prev) =>
      prev.map((char) => (char.id === id ? { ...char, [field]: value } : char))
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
    <>
      {/* Desktop Background - GLOBAL FIXED */}
      <div className={styles.desktopBgContainer}>
        <Image
          src="/images/backgrounds/landing-desktop.jpg"
          alt="Background"
          fill
          // Nota: El object-position: bottom está forzado en el CSS ahora
          className="object-cover"
          priority
          quality={100}
          sizes="100vw"
        />
      </div>

      {/* AQUÍ aplicamos la clase mainResponsive para achicar la UI en notebooks */}
      <main className={`${styles.mainResponsive} h-screen overflow-y-auto md:h-auto md:overflow-visible snap-y snap-mandatory scroll-smooth relative flex flex-col items-center`}>

        {/* SECTION 1: Header (Mobile: Screen 1, Desktop: Top) */}
        <section className="snap-start w-full relative flex flex-col items-center justify-center p-4 h-[100dvh] md:h-auto md:max-w-7xl md:pt-4 shrink-0">

          {/* Mobile Background 1 */}
          <div className={styles.mobileBgContainer}>
            <Image
              src="/images/backgrounds/landing-mobile1.jpg"
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
          <div className={`flex flex-col items-center animate-fade-in-down mb-4 md:mb-1 z-10 ${styles.titleContainer}`}>
            <div className="relative w-80 h-40 md:w-96 md:h-48">
              <Image
                src="/images/ui/title.png"
                alt="Cuento Kilometros"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 90vw, 50vw"
              />
            </div>
            <div className="relative w-14 h-14 md:w-16 md:h-16 -mt-4 md:-mt-6">
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
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna.
          </p>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 animate-bounce md:hidden z-10 text-white/70">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </div>
        </section>

        {/* SECTION 2: Form (Mobile: Screen 2, Desktop: Main) */}
        <section className="snap-start w-full relative flex flex-col items-center p-2 min-h-[100dvh] md:min-h-0 md:h-auto md:max-w-7xl md:pb-2 shrink-0">

          {/* Mobile Background 2 */}
          <div className={styles.mobileBgContainer}>
            <Image
              src="/images/backgrounds/landing-mobile2.jpg"
              alt="Background Mobile 2"
              fill
              className="object-cover"
              priority
              quality={100}
              sizes="100vw"
            />
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
          </div>

          {/* Characters Grid */}
          <div className="w-full flex flex-col md:flex-row items-center md:items-start md:justify-center gap-4 max-w-6xl mt-4 md:mt-0 z-10">
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
            <div className="flex flex-row items-center justify-center md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-4">
              {characters.length < 6 && (
                <button
                  onClick={addCharacter}
                  className="flex items-center justify-center gap-2 bg-[var(--color-brand-pink,#E91E63)] text-white px-5 py-2 rounded-full font-medium text-sm shadow-lg hover:bg-pink-600 transition-colors transform hover:scale-105 active:scale-95 w-auto md:w-full min-w-[140px] cursor-pointer"
                >
                  <Plus size={16} />
                  Agregar
                </button>
              )}

              {characters.length > 1 && (
                <button
                  onClick={() => setCharacters((prev) => prev.slice(0, -1))}
                  className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full font-medium text-sm transition-colors border border-white/40 w-auto md:w-full min-w-[140px] cursor-pointer"
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
          <div className="mt-4 md:mt-4 pb-10 md:pb-0 z-10">
            <button
              onClick={handleGenerate}
              className="bg-[var(--color-brand-pink,#E91E63)] text-white text-base md:text-lg px-10 py-3 rounded-full font-medium shadow-xl hover:bg-pink-600 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={!selectedCar || isLoading}
            >
              {isLoading ? "Creando magia..." : "Crear cuento"}
            </button>
          </div>

          {/* --- Result Section --- */}
          {story && audioSrc && (
            <div className="w-full max-w-2xl mt-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white z-10 animate-fade-in-up">
              <h3 className="text-xl font-bold mb-4 text-center">
                ¡Tu cuento está listo!
              </h3>

              <div className="w-full mb-6 flex justify-center">
                <audio controls src={audioSrc} className="w-full" autoPlay />
              </div>

              <div className="max-h-60 overflow-y-auto pr-2 mb-6 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
                <p className="whitespace-pre-wrap">{story}</p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-lg cursor-pointer"
                >
                  Descargar / Guardar
                </button>
              </div>
            </div>
          )}
        </section>

        {/* --- Loading Overlay --- */}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#6b26ff]/90 backdrop-blur-sm">
            <div className="relative w-32 h-32 animate-pulse">
              <Image
                src="/images/ui/renault-logo.svg"
                alt="Loading"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-white text-xl mt-4 font-medium animate-bounce">
              Generando tu historia...
            </p>
          </div>
        )}

        {/* --- Email Modal --- */}
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Guardar tu cuento
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Ingresa tu email para recibir el cuento y novedades.
              </p>

              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600 text-black"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-gray-500 hover:text-gray-700 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEmail}
                  disabled={isSavingEmail}
                  className="bg-[var(--color-brand-pink,#E91E63)] text-white px-6 py-2 rounded-full font-medium hover:bg-pink-600 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSavingEmail ? "Enviando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Validation Modal --- */}
        {validationErrors && validationErrors.length > 0 && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-bounce-in border-l-4 border-[var(--color-brand-pink,#E91E63)]">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                ¡Faltan algunos detalles!
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Para que el cuento quede genial, completa la información faltante:
              </p>

              <div className="max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
                {validationErrors.map((error, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 p-3 rounded-lg mb-3 text-sm text-gray-700 border border-gray-200"
                  >
                    {error.missingField === "name" ? (
                      <>
                        Rol:{" "}
                        <span className="font-semibold">{error.currentRole}</span>
                        <br />
                        <span className="text-red-500 font-medium">
                          ⚠️ Falta el Nombre
                        </span>
                      </>
                    ) : (
                      <>
                        Nombre:{" "}
                        <span className="font-semibold">{error.currentName}</span>
                        <br />
                        <span className="text-red-500 font-medium">
                          ⚠️ Falta el Rol
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setValidationErrors(null)}
                  className="bg-[var(--color-brand-pink,#E91E63)] text-white px-6 py-2 rounded-full font-medium hover:bg-pink-600 transition-colors shadow-lg cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}