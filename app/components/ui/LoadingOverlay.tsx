import Image from "next/image";
import { useState, useEffect } from "react";

const LOADING_MESSAGES = [
    "Cargando combustible mágico...",
    "Inflando las ruedas lunares...",
    "Ajustando los espejos intergalácticos...",
    "Buscando la ruta en el mapa secreto...",
    "Escribiendo la próxima aventura..."
];

export const LoadingOverlay = () => {
    const [messageDisplay, setMessageDisplay] = useState(LOADING_MESSAGES[0]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % LOADING_MESSAGES.length;
            setMessageDisplay(LOADING_MESSAGES[index]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#6b26ff]/90 backdrop-blur-sm">
            <div className="relative w-32 h-32 animate-pulse">
                <Image
                    src="/images/ui/renault-logo.svg"
                    alt="Loading"
                    fill
                    className="object-contain"
                />
            </div>
            <p className="text-white text-xl mt-4 font-medium animate-bounce text-center px-4">
                {messageDisplay}
            </p>
        </div>
    );
};
