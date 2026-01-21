import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json(
                { error: "Missing 'text' field" },
                { status: 400 }
            );
        }

        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            console.error("ELEVENLABS_API_KEY is missing");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const client = new ElevenLabsClient({ apiKey });
        const voiceId = "gSYqSbtMajxq5LUT0bNl"; // "Bill" voice

        // Generate audio as a stream
        const audioStream = await client.generate({
            voice: voiceId,
            text: text,
            model_id: "eleven_multilingual_v2",
            stream: true, // IMPORTANT: Enable streaming
            voice_settings: {
                stability: 0.8,
                similarity_boost: 0.5,
                style: 0.0,
                use_speaker_boost: true,
            },
            optimize_streaming_latency: 3,
        });

        // Return the stream directly to the client
        // @ts-ignore: ElevenLabs stream is compatible with standard ReadableStream but types might conflict slightly
        return new NextResponse(audioStream, {
            headers: {
                "Content-Type": "audio/mpeg",
            },
        });
    } catch (error: any) {
        console.error("Error in generate-audio:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate audio" },
            { status: 500 }
        );
    }
}
