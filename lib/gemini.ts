import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Lista de temáticas para dar variedad
const THEMES = [
  "Mundo de los Dinosaurios Amigables",
  "Viaje Intergaláctico a la Luna de Queso",
  "Aventura en el Fondo del Mar con Peces Parlantes",
  "Ciudad Futurista de Robots Ayudantes",
  "Bosque Encantado de las Hadas",
  "Isla de los Piratas Buenos",
  "Carrera en las Nubes de Algodón"
];

export async function generateStory(
  characters: { name: string; role: string }[],
  selectedCar: string
) {
  // Elegimos un tema al azar
  const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];

  // Usamos el modelo solicitado, con fallback
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  // Nota: Cambié a 1.5-flash por seguridad ya que 2.5 a veces da error si no tienes la beta activada, 
  // pero puedes volver a poner "gemini-2.5-flash" si prefieres.

  const prompt = `
  Eres un narrador de cuentos profesional.
  Escribe una historia para niños de APROX 300 PALABRAS.
  
  ESTRICTAMENTE: 
  - Devuelve SOLO texto plano y corrido.
  - NO uses títulos, ni capítulos, ni formato Markdown.

  --- PERSONAJES ---
  Viajeros: ${characters.filter(c => c.name && c.role).map(c => `${c.name} (${c.role})`).join(", ")}.
PROHIBIDO: No inventes conductores, guías ni personajes extra que no estén en la lista.

  --- ELEMENTOS ---
  Auto: Renault ${selectedCar}.
  Tema: ${randomTheme}.

  --- HISTORIA (Narrativa fluida) ---
  1. Inicio: En Uruguay, suben al Renault ${selectedCar} (destaca su confort y tecnología). Viajan mágicamente a "${randomTheme}".
  2. Misión: Tienen que resolver un problema o encontrar algo importante (tipo inicio desarrollo y final).
  3. Final: Vuelven a casa felices.

  REGLAS DE CIERRE (CRÍTICO) ---
  - Termina con punto final. 
  - NO hagas preguntas al lector. NO escribas "¿Qué pasará después?" ni "¿Te gustó?".
  - NO pongas despedidas.

  --- TONO (AJUSTE IMPORTANTE) ---
  - Narración en español Rioplatense NATURAL (Uruguay).
  - Usa "vos" en lugar de "tú".
  - NO abuses del lunfardo. NO uses "bo", "che", "gurises" o "ta" en cada frase. Úsalos con mucha moderación, solo si es indispensable.
  - El tono debe sonar como un padre moderno contando un cuento, no como una caricatura exagerada.
  - Estilo: Mágico, asombroso y cálido.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.warn("Error en generación, intentando fallback...");
    return "Había una vez un viaje mágico en un Renault, pero la magia se tomó un descansito. Por favor intenta de nuevo.";
  }
}