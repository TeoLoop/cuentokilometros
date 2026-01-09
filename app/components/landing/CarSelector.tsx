import { motion } from "framer-motion";
import Image from "next/image";

interface Car {
    id: string;
    name: string;
    image: string;
}

const CARS: Car[] = [
    { id: "arkana", name: "Arkana", image: "/images/cars/arkana.png" },
    { id: "clio-v", name: "Clio", image: "/images/cars/clio-v.png" },
    { id: "duster", name: "Duster", image: "/images/cars/duster.png" },
    { id: "kangoo", name: "Kangoo", image: "/images/cars/kangoo.png" },
    { id: "kardian", name: "Kardian", image: "/images/cars/kardian.png" },
    { id: "koleos", name: "Koleos", image: "/images/cars/koleos.png" },
    { id: "kwid", name: "Kwid", image: "/images/cars/kwid.png" },
    { id: "oroch", name: "Oroch", image: "/images/cars/oroch.png" },
    { id: "stepway", name: "Stepway", image: "/images/cars/stepway.png" },
];

interface CarSelectorProps {
    selectedCar: string | null;
    onSelect: (carId: string) => void;
}

export function CarSelector({ selectedCar, onSelect }: CarSelectorProps) {

    return (
        <div className="w-full max-w-7xl mx-auto mt-4 px-4 overflow-hidden relative">
            <h3 className="text-white text-center text-lg font-medium mb-4 drop-shadow-md">
                Elegí tu Renault de viaje
            </h3>

            {/* Container for grid/scroll */}
            <div
                className="grid grid-cols-3 gap-2 md:flex md:justify-center md:gap-4 justify-items-center"
            >
                {CARS.map((car) => {
                    const isSelected = selectedCar === car.id;

                    return (
                        <div
                            key={car.id}
                            onClick={() => onSelect(car.id)}
                            className="relative cursor-pointer w-full max-w-[100px] flex flex-col items-center"
                        >
                            {/* Selection Highlight */}
                            {isSelected && (
                                <motion.div
                                    layoutId="selected-car"
                                    className="absolute inset-0 border-2 border-[var(--brand-pink, #E91E63)] rounded-xl z-0"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}

                            {/* Car Card - Smaller and contained */}
                            <div className={`relative z-10 p-2 flex flex-col items-center transition-opacity duration-300 w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm ${isSelected ? 'opacity-100 bg-white/20' : 'opacity-70 hover:opacity-100'}`}>
                                <div className="relative w-full aspect-[2/1]">
                                    <Image
                                        src={car.image}
                                        alt={car.name}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <span className="text-white text-[10px] md:text-xs mt-1 font-medium drop-shadow-sm text-center truncate w-full">{car.name}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
