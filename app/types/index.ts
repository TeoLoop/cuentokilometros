export interface Character {
    id: number;
    name: string;
    role: string;
}

export interface ValidationError {
    charId: number;
    missingField: "name" | "role" | "all";
    currentName: string;
    currentRole: string;
}

export interface StoryResponse {
    story: string;
    audio: string; // Base64 string
}

export interface StoryPayload {
    characters: Character[];
    selectedCar: string;
}
