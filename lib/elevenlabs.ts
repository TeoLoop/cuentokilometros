import { ElevenLabsClient } from "elevenlabs";

// Validación de la API Key para que TypeScript no se queje de 'undefined'
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  throw new Error("ELEVENLABS_API_KEY is missing in environment variables");
}

// Inicializar cliente oficial
const client = new ElevenLabsClient({
  apiKey: apiKey,
});

export async function generateAudio(text: string): Promise<Buffer> {
  try {
    // ID de la voz "Bill" (Narrador estilo documental/cuento)
    // Si prefieres a Rachel usa: "21m00Tcm4TlvDq8ikWAM" otro: "NDcVpQJv7Naa7ZKrqtEk" default "pqHfZKP75CvOlQylNhV4"

    const voiceId = "gSYqSbtMajxq5LUT0bNl";

    const audioStream = await client.generate({
      voice: voiceId,
      text: text,
      model_id: "eleven_multilingual_v2", // Crucial para que hable bien español
      voice_settings: {
        stability: 0.8, // Mayor estabilidad para evitar cambios de tono
        similarity_boost: 0.5, // Menor boost para evitar saturación/artefactos
        style: 0.0,
        use_speaker_boost: true,
        speed: 1.00, // Velocidad normal
      },
    });

    // Convertir el Stream a Buffer (necesario para enviarlo al frontend)
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
  } catch (error) {
    console.error("Error generating audio with ElevenLabs:", error);
    throw error;
  }
}
