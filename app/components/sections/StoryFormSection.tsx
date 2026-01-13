import Image from "next/image";
import { Plus } from "lucide-react";
import styles from "../../Home.module.css";
import { Character } from "@/app/types";
import { CarSelector } from "../landing/CarSelector";
import { CharacterInput } from "../landing/CharacterInput";

interface StoryFormSectionProps {
    characters: Character[];
    selectedCar: string | null;
    isLoading: boolean;
    onCharacterChange: (id: number, field: "name" | "role", value: string) => void;
    onAddCharacter: () => void;
    onRemoveCharacter: () => void;
    onSelectCar: (car: string) => void;
    onGenerate: () => void;
    children?: React.ReactNode; // For the ResultCard
}

export const StoryFormSection = ({
    characters,
    selectedCar,
    isLoading,
    onCharacterChange,
    onAddCharacter,
    onRemoveCharacter,
    onSelectCar,
    onGenerate,
    children,
}: StoryFormSectionProps) => {
    return (
        <section
            id="create-story-section"
            className="snap-start w-full relative flex flex-col items-center p-2 min-h-[100dvh] md:min-h-0 md:h-auto md:max-w-7xl md:pb-2 shrink-0"
        >
            {/* Mobile Background 2 */}
            <div className={styles.mobileBgContainer}>
                <Image
                    src="/images/backgrounds/landing-mobile2.jpg"
                    alt="Background Mobile 2"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                    sizes="(max-width: 768px) 100vw, 1vw"
                />
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
            </div>

            {/* Content Wrapper for Mobile Scaling */}
            <div className={`w-full flex flex-col items-center ${styles.mobileFormResponsive}`}>
                {/* Characters Grid */}
                <div className="w-full flex flex-col md:flex-row items-center md:items-start md:justify-center gap-4 max-w-6xl mt-4 md:mt-0 z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 w-full justify-items-center">
                        {characters.map((char, index) => (
                            <CharacterInput
                                key={char.id}
                                {...char}
                                index={index}
                                onChange={onCharacterChange}
                            />
                        ))}
                    </div>

                    {/* Buttons Row/Column */}
                    <div className="flex flex-row items-center justify-center md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-6">
                        {characters.length < 6 && (
                            <button
                                onClick={onAddCharacter}
                                className="flex items-center justify-center gap-2 bg-[var(--color-brand-pink,#E91E63)] text-white px-5 py-2 rounded-full font-medium text-sm md:text-base shadow-lg hover:bg-pink-600 transition-colors transform hover:scale-105 active:scale-95 w-auto md:w-full min-w-[140px] cursor-pointer"
                            >
                                <Plus size={16} />
                                Agregar
                            </button>
                        )}

                        {characters.length > 1 && (
                            <button
                                onClick={onRemoveCharacter}
                                className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full font-medium text-sm md:text-base transition-colors border border-white/40 w-auto md:w-full min-w-[140px] cursor-pointer"
                            >
                                Eliminar último
                            </button>
                        )}
                    </div>
                </div>

                {/* Car Selector */}
                <div className="z-10 w-full flex justify-center">
                    <CarSelector selectedCar={selectedCar} onSelect={onSelectCar} />
                </div>

                {/* CTA Button */}
                <div className="mt-4 md:mt-4 pb-10 md:pb-0 z-10">
                    <button
                        onClick={onGenerate}
                        className="bg-[var(--color-brand-pink,#E91E63)] text-white text-base md:text-lg px-10 py-3 rounded-full font-medium shadow-xl hover:bg-pink-600 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        disabled={!selectedCar || isLoading}
                    >
                        {isLoading ? "Creando magia..." : "Crear cuento"}
                    </button>
                </div>

                {/* --- Result Section Component Injection --- */}
                {children}
            </div>
        </section>
    );
};
