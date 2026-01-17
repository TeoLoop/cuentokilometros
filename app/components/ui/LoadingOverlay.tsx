import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_MESSAGES = [
    "Cargando combustible mágico...",
    "Inflando las ruedas lunares...",
    "Ajustando los espejos intergalácticos...",
    "Buscando la ruta en el mapa secreto...",
    "Escribiendo la próxima aventura...",
    "Sintonizando radio cuentos...",
    "Llenando el tanque de imaginación...",
    "Limpiando polvo de estrellas del parabrisas...",
    "Despertando a los duendes del motor...",
    "Cargando el GPS de mundos perdidos...",
    "Calibrando los propulsores de velocidad luz...",
    "Escaneando el horizonte en busca de dragones...",
    "Guardando bocadillos en la guantera mágica...",
    "Activando el escudo anti-aburrimiento...",
    "Conectando con la torre de control de la fantasía...",
    "Encendiendo las luces altas para ver el futuro...",
    "Abrochando cinturones de seguridad invisibles..."
];

export const LoadingOverlay = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#1a0540]">
            {/* 1. Fondo Premium: Gradiente Radial Profundo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4c1d95] via-[#2e1065] to-[#1a0540] opacity-100" />

            {/* 2. Efecto de Partículas/Estrellas (Sutil) */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[20%] left-[20%] w-1 h-1 bg-white rounded-full animate-pulse" />
                <div className="absolute top-[60%] left-[80%] w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse delay-75" />
                <div className="absolute top-[40%] right-[30%] w-1 h-1 bg-blue-200 rounded-full animate-ping delay-150" />
                <div className="absolute bottom-[30%] left-[40%] w-1 h-1 bg-white/50 rounded-full animate-bounce delay-300" />
            </div>

            {/* 3. Contenedor del Logo con Animación de Respiración y Glow */}
            <div className="relative z-10 mb-8">
                {/* Glow Effect */}
                <motion.div
                    className="absolute inset-0 bg-yellow-400/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Logo Principal Respirando */}
                <motion.div
                    className="relative w-32 h-32 md:w-40 md:h-40"
                    animate={{
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Image
                        src="/images/ui/renault-logo.svg"
                        alt="Loading"
                        fill
                        className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                        priority
                    />
                </motion.div>
            </div>

            {/* 4. Texto Dinámico con Transiciones Suaves */}
            <div className="relative z-10 h-10 flex items-center justify-center px-4 w-full text-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={messageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="text-white/90 text-xl md:text-2xl font-sans font-light tracking-wide drop-shadow-lg"
                    >
                        {LOADING_MESSAGES[messageIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
};
