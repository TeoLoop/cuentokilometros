import { NextRequest, NextResponse } from "next/server";
import { generateStory } from "@/lib/gemini";


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

    // 1. Generate Story Text Stream
    const geminiStream = await generateStory(characters, selectedCar);

    // Create a ReadableStream to stream the text chunks
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of geminiStream.stream) {
          const chunkText = chunk.text();
          controller.enqueue(chunkText);
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      }
    });
  } catch (error: any) {
    console.error("Error in generate-story:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate story" },
      { status: 500 }
    );
  }
}
