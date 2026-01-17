import Image from "next/image";
import styles from "../../Home.module.css";

interface HeroSectionProps {
    onStartClick: () => void;
}

export const HeroSection = ({ onStartClick }: HeroSectionProps) => {
    return (
        <section className="snap-start w-full relative flex flex-col items-center justify-center p-4 h-[100dvh] md:h-auto md:max-w-7xl md:pt-4 shrink-0 overflow-hidden">
            {/* --- CAPA 1: Fondo de Estrellas (Lo más atrás) --- */}
            <div className={styles.mobileBgContainer}>
                {/* Esta imagen debe ser SOLO estrellas/fondo, SIN la mancha */}
                <Image
                    src="/images/backgrounds/mobile1.jpg"
                    alt="Background Stars"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={100}
                    sizes="(max-width: 768px) 100vw, 1vw"
                />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            </div>

            {/* --- CONTENEDOR PRINCIPAL (Wrapper) --- 
               Este div agrupa el texto y la sombra.
               CAMBIO CLAVE: Agregamos 'relative' aquí.
            */}
            <div className="relative flex flex-col items-center justify-center z-10 w-full max-w-md">

                {/* --- CAPA 2: La Sombra (AHORA DENTRO DEL WRAPPER) --- */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] max-w-[550px] aspect-square z-0 pointer-events-none opacity-90 md:hidden">
                    <div className="relative w-full h-full">
                        <Image
                            src="/images/backgrounds/sombra.png"
                            alt=""
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            priority
                        />
                    </div>
                </div>
                {/* --- CAPA 3: Contenido (Texto, Logo) --- */}
                <div className="relative z-10 flex flex-col items-center">
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
                                priority
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

                    <p
                        className="text-white text-center text-sm md:hidden w-full max-w-sm drop-shadow-md px-4 font-medium mb-6 mx-auto text-balance leading-relaxed"
                    >
                        <span className="block mb-2">
                            Porque cada Kilómetro en tu Renault es una aventura,
                            creamos Cuento Kilómetros.
                        </span>

                        <span className="block">
                            Una plataforma de audio cuentos pensados para escuchar en el camino, junto a quienes viajan con vos y tu Renault.
                        </span>
                    </p>
                </div>
            </div>
            {/* Fin del Wrapper Principal */}

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