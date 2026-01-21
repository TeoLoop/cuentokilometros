import { useState } from "react";
import { Character, ValidationError } from "@/app/types";
import { generateStory, saveEmail, generateAudioStream } from "@/app/services/storyService";

export const useStoryApp = () => {
    const [characters, setCharacters] = useState<Character[]>([
        { id: 1, name: "", role: "" },
        { id: 2, name: "", role: "" },
        { id: 3, name: "", role: "" },
    ]);
    const [selectedCar, setSelectedCar] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [story, setStory] = useState("");
    const [audioSrc, setAudioSrc] = useState("");
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [email, setEmail] = useState("");
    const [isSavingEmail, setIsSavingEmail] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationError[] | null>(
        null
    );

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

    const removeCharacter = () => {
        if (characters.length > 1) {
            setCharacters((prev) => prev.slice(0, -1));
        }
    };

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
            // Generic validation error
            setValidationErrors([
                {
                    charId: 0, // ID 0 represents global/generic
                    missingField: "all",
                    currentName: "",
                    currentRole: "",
                },
            ]);
            return;
        }

        setIsLoading(true);
        setStory("");
        setAudioSrc("");

        try {
            // 1. Generate Story Text Stream
            const response = await generateStory(characters, selectedCar);
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedStory = "";
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    accumulatedStory += chunk;
                }
            }

            setStory(accumulatedStory);

            // 2. Generate Audio Stream (Once story is complete)
            const audioResponse = await generateAudioStream(accumulatedStory);
            if (!audioResponse.body) throw new Error("No audio response body");

            // DETECCION DE IOS (Para Fallback)
            const isIOS = typeof navigator !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent);

            if (isIOS) {
                // --- ESTRATEGIA IOS: Blob Completo (Estabilidad) ---
                console.log("iOS detectado: Usando estrategia Blob fallback");
                const blob = await audioResponse.blob();
                const url = URL.createObjectURL(blob);
                setAudioSrc(url);
            } else {
                // --- ESTRATEGIA STANDARD: True Streaming (Velocidad) ---
                const mediaSource = new MediaSource();
                const audioUrl = URL.createObjectURL(mediaSource);
                setAudioSrc(audioUrl); // El <audio> se conecta YA mismo al MediaSource

                const audioChunks: any[] = [];

                mediaSource.addEventListener("sourceopen", async () => {
                    const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
                    const reader = audioResponse.body!.getReader();
                    const queue: any[] = [];
                    let isAppending = false;

                    const processQueue = () => {
                        if (queue.length > 0 && !isAppending && !sourceBuffer.updating) {
                            isAppending = true;
                            const chunk = queue.shift()!;
                            try {
                                sourceBuffer.appendBuffer(chunk);
                            } catch (e) {
                                console.error("Error appending buffer", e);
                            }
                        }
                    };

                    sourceBuffer.addEventListener("updateend", () => {
                        isAppending = false;
                        processQueue();
                    });

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            if (!sourceBuffer.updating && queue.length === 0) {
                                mediaSource.endOfStream();
                            } else {
                                // Si todavía está procesando, esperamos que termine antes de cerrar
                                const checkEnd = setInterval(() => {
                                    if (!sourceBuffer.updating && queue.length === 0) {
                                        clearInterval(checkEnd);
                                        if (mediaSource.readyState === 'open') {
                                            mediaSource.endOfStream();
                                        }
                                    }
                                }, 100);
                            }

                            // --- FINALIZAR: Crear Blob para descarga ---
                            const fullAudioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
                            const fullAudioUrl = URL.createObjectURL(fullAudioBlob);
                            // Reemplazamos el src del MediaSource por el del Blob completo 
                            // para que el botón de descarga funcione correctamente
                            setAudioSrc(fullAudioUrl);
                            break;
                        }

                        if (value) {
                            // 1. Playback Logic
                            queue.push(value as any);
                            processQueue();

                            // 2. Save Logic
                            audioChunks.push(value);
                        }
                    }
                });
            }

            // 3. Reveal Content
            setIsLoading(false);
        } catch (e) {
            console.error(e);
            alert("Error al conectar con el servidor o generar el cuento.");
            setIsLoading(false);
        }
    };

    const handleSaveEmail = async () => {
        if (!email) return;

        // Recuperamos el archivo real desde la URL del blob para poder compartirlo
        let fileToShare: File | null = null;
        if (audioSrc) {
            try {
                const blob = await fetch(audioSrc).then((r) => r.blob());
                fileToShare = new File([blob], "cuento-kilometros.mp3", {
                    type: "audio/mpeg",
                });
            } catch (e) {
                console.error("Error preparando archivo para compartir", e);
            }
        }

        // ESTRATEGIA:
        // 1. Si es móvil (width < 768px) Y soporta compartir archivos -> Usar Menú Nativo
        // 2. En Desktop o si no soporta compartir -> Usar descarga forzada clásica
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

        if (
            isMobile &&
            fileToShare &&
            navigator.canShare &&
            navigator.canShare({ files: [fileToShare] })
        ) {
            try {
                await navigator.share({
                    files: [fileToShare],
                });
            } catch (error) {
                // El usuario canceló el menú de compartir, no es un error crítico
                console.log("Compartir cancelado o fallido", error);
            }
        } else if (audioSrc) {
            // Fallback para Desktop (tu código original)
            const link = document.createElement("a");
            link.href = audioSrc;
            link.download = "cuento-kilometros.mp3";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Guardamos el email en BD (siempre, haya descargado o no)
        setIsSavingEmail(true);
        try {
            await saveEmail(email);
            setShowEmailModal(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSavingEmail(false);
        }
    };

    return {
        characters,
        selectedCar,
        isLoading,
        story,
        audioSrc,
        showEmailModal,
        email,
        isSavingEmail,
        validationErrors,
        handleCharacterChange,
        addCharacter,
        removeCharacter,
        setSelectedCar,
        handleGenerate,
        handleSaveEmail,
        setEmail,
        setShowEmailModal,
        setValidationErrors,
    };
};
