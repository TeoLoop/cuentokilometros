import Image from "next/image";
import styles from "../../Home.module.css";

interface HeroSectionProps {
    onStartClick: () => void;
}

export const HeroSection = ({ onStartClick }: HeroSectionProps) => {
    return (
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

            {/* Logo and Title - Centered via Parent justify-center */}
            <div className="flex flex-col items-center justify-center z-10 w-full max-w-md">
                <div
                    className={`flex flex-col items-center animate-fade-in-down mb-4 md:mb-1 ${styles.titleContainer}`}
                >
                    <div className="relative w-64 h-32 md:w-96 md:h-48">
                        <Image
                            src="/images/ui/title.png"
                            alt="Cuento Kilometros"
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 90vw, 50vw"
                        />
                    </div>
                    <div className="relative w-12 h-12 md:w-16 md:h-16 -mt-3 md:-mt-6">
                        <Image
                            src="/images/ui/renault-logo.svg"
                            alt="Renault"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                <p className="text-white text-center text-xs sm:text-sm md:hidden max-w-xs drop-shadow-md px-4 font-medium mb-6">
                    Porque cada Kilómetro en tu Renault es una aventura, creamos Cuento
                    Kilómetros. Una plataforma de audio cuentos pensados para escuchar en
                    el camino, junto a quienes viajan con vos y tu Renault.
                </p>
            </div>

            <button
                onClick={onStartClick}
                className="md:hidden absolute bottom-24 bg-white/10 backdrop-blur-md border border-white/30 text-white text-base px-8 py-3 rounded-full font-medium shadow-lg hover:bg-white/20 transition-all transform hover:scale-105 active:scale-95 z-10 cursor-pointer animate-fade-in-up"
            >
                Empezá tu Cuento Kilómetros
            </button>

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
    );
};
