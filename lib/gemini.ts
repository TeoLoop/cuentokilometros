import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateStory(
  characters: { name: string; role: string }[],
  selectedCar: string
) {
  // Using the model requested by the user
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
    Actúa como un cuentacuentos amable para niños pequeños en Uruguay.
    Escribe un cuento corto (aprox 100 palabras) sobre un viaje familiar.

    INFORMACIÓN DEL VIAJE:
    - Personajes: ${characters
      .filter((c) => c.name.trim() && c.role.trim())
      .map((c) => `${c.name} (${c.role})`)
      .join(", ")}.
    - El vehículo es un Renault modelo: ${selectedCar}.

    REGLAS DE TONO Y ESTILO:
    1. LENGUAJE: Usa español rioplatense suave (voseo, palabras como "auto", "lindo", "re divertirse"), pero que sea fácil de entender para un niño.
    2. SEGURIDAD: El viaje debe ser seguro y tranquilo. PROHIBIDO mencionar alta velocidad, carreras, peligros o maniobras arriesgadas. La aventura está en el paisaje, las canciones o los juegos dentro del auto.
    3. AMBIENTE: Tono infantil, mágico y positivo. Enfócate en la comodidad del auto y la alegría de compartir el viaje.

    FORMATO DE SALIDA:
    - Retorna SOLO el texto del cuento.
    - NO uses formato markdown (nada de negritas ni títulos).
    - Texto plano, corrido.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.warn("Gemini 2.5 failed or not available");
    // Fallback in case the specific requested model tag isn't live for this key
    const fallbackModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    const result = await fallbackModel.generateContent(prompt);
    return result.response.text();
  }
}
