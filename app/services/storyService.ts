import { Character, StoryPayload, StoryResponse } from "../types";

export const generateStory = async (
    characters: Character[],
    selectedCar: string
): Promise<Response> => {
    const res = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characters, selectedCar } as StoryPayload),
    });

    if (!res.ok) {
        throw new Error("Error generating story");
    }

    return res;
};

export const generateAudioStream = async (text: string): Promise<Response> => {
    const res = await fetch("/api/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });

    if (!res.ok) {
        throw new Error("Error generating audio");
    }

    return res;
};

export const saveEmail = async (email: string): Promise<void> => {
    const res = await fetch("/api/save-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        throw new Error("Error saving email");
    }
};
