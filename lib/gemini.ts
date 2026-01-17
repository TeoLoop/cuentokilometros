import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Lista de temáticas para dar variedad
const THEMES = [
  "El Valle Secreto de los Dinosaurios Inventores",
  "Viaje Intergaláctico a la Luna de Queso y Estrellas de Azúcar",
  "Misión Submarina en la Ciudad de los Peces Luminosos",
  "La Gran Carrera en la Ciudad del Futuro",
  "El Bosque Encantado donde los Árboles Cuentan Chistes",
  "La Isla del Tesoro de Chocolate de los Piratas Buenos",
  "Campeonato de Vuelo entre Nubes de Algodón",
  "Expedición al Polo Norte de los Pingüinos Bailarines",
  "Safari en la Selva de los Juguetes Perdidos",
  "El Castillo de los Dragones que Escupen Burbujas",
  "Misterio en la Fábrica de Arcoíris",
  "El Planeta Gelatina donde todo Rebota",
  "El Jardín Gigante de los Insectos Musicos"
];

export async function generateStory(
  characters: { name: string; role: string }[],
  selectedCar: string
) {
  // Elegimos un tema al azar
  const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
    console.log("Respuesta cruda de Gemini:", response.text());
    return response.text();
  } catch (error) {
    console.warn("Error en generación, intentando fallback...");
    return "Había una vez un viaje mágico en un Renault, pero la magia se tomó un descansito. Por favor intenta de nuevo.";
  }
}