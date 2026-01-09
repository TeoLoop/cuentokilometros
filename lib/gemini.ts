import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateStory(
  characters: { name: string; role: string }[],
  selectedCar: string
) {
  // Using the model requested by the user
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
    Escribe un cuento corto (aprox 100 palabras).
    Los personajes son: ${characters
      .filter((c) => c.name.trim() && c.role.trim()) // Only use complete characters
      .map((c) => `${c.name} (${c.role})`)
      .join(", ")}.
    El protagonista viaja en un auto modelo: ${selectedCar}.
    El cuento debe ser divertido, emocionante y centrado en el viaje en el auto.
    
    IMPORTANTE:
    - Retorna SOLO el texto del cuento.
    - NO uses formato markdown (negritas, títulos, etc).
    - Texto plano.
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
