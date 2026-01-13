import { useState } from "react";
import { Character, ValidationError } from "@/app/types";
import { generateStory, saveEmail } from "@/app/services/storyService";

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
            const data = await generateStory(characters, selectedCar);
            setStory(data.story);
            // Base64 to Blob conversion logic
            const byteCharacters = atob(data.audio);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "audio/mpeg" });
            const url = URL.createObjectURL(blob);
            setAudioSrc(url);
        } catch (e) {
            console.error(e);
            alert("Error al conectar con el servidor o generar el cuento.");
        } finally {
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
        // 1. Si es móvil/soporta compartir archivos -> Usar Menú Nativo (iOS Friendly)
        // 2. Si es Desktop -> Usar descarga forzada clásica
        if (
            fileToShare &&
            navigator.canShare &&
            navigator.canShare({ files: [fileToShare] })
        ) {
            try {
                await navigator.share({
                    files: [fileToShare],
                    title: "Cuento Kilómetros",
                    text: "Escucha este cuento creado con Renault.",
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
