import { NextRequest, NextResponse } from "next/server";
import { generateStory } from "@/lib/gemini";
import { generateAudio } from "@/lib/elevenlabs";

export const maxDuration = 300; // Allow 5 minutes for generation

export async function POST(req: NextRequest) {
  try {
    const { characters, selectedCar } = await req.json();

    if (!characters || !selectedCar) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Generate Story Text
    const story = await generateStory(characters, selectedCar);

    // 2. Generate Audio (Base64)
    const audioBuffer = await generateAudio(story);
    const audioBase64 = audioBuffer.toString("base64");

    return NextResponse.json({
      story,
      audio: audioBase64,
    });
  } catch (error: any) {
    console.error("Error in generate-story:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate story" },
      { status: 500 }
    );
  }
}
