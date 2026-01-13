import { Character, StoryPayload, StoryResponse } from "../types";

export const generateStory = async (
    characters: Character[],
    selectedCar: string
): Promise<StoryResponse> => {
    const res = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characters, selectedCar } as StoryPayload),
    });

    if (!res.ok) {
        throw new Error("Error generating story");
    }

    const data = await res.json();
    if (!data.story || !data.audio) {
        throw new Error("Invalid response format");
    }

    return data;
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
