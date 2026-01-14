import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateStory(
  characters: { name: string; role: string }[],
  selectedCar: string
) {
  // Using the model requested by the user
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Actúa como un cuentacuentos de fantasía para niños pequeños en Uruguay. 
    Escribe un cuento corto (aprox 100 palabras) sobre una aventura mágica.

    ELEMENTOS OBLIGATORIOS:
    - Viajeros ÚNICAMENTE: ${characters
      .filter((c) => c.name.trim() && c.role.trim())
      .map((c) => `${c.name} (${c.role})`)
      .join(", ")}. (No menciones conductores ni otros personajes).
    - El vehículo es un Renault modelo: ${selectedCar}.

    REGLAS DE FANTASÍA:
    1. EL AUTO MÁGICO: El Renault ${selectedCar} no solo es un auto, es un "Navegador de Sueños". El techo solar muestra galaxias, las ventanas revelan mundos secretos y el interior es un refugio de nubes mullidas.
    2. PAISAJE TRANSFORMADO: El Uruguay del cuento debe ser fantástico. Los árboles pueden ser de cristal, el Río de la Plata de chocolate o las nubes de algodón de azúcar.
    3. SEGURIDAD Y PAZ: El viaje es un deslizamiento suave y calmo. La magia está en el asombro de descubrir cosas lindas por la ventana, cantar canciones que crean flores o charlar con el paisaje.
    4. LENGUAJE: Rioplatense tierno ("auto", "lindo", "baúl").
    5. RESTRICCIÓN: Solo los personajes mencionados.

    FORMATO DE SALIDA:
    - Retorna SOLO el texto del cuento.
    - Texto plano y corrido.
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
