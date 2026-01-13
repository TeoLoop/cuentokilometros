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
            alert("Agrega al menos un personaje completo (nombre y rol).");
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
        setIsSavingEmail(true);
        try {
            await saveEmail(email);
            setShowEmailModal(false);

            // Auto-download Audio
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
