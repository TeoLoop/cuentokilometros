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
    Eres un cuentacuentos uruguayo. Escribe un cuento para niños de APROX 300 PALABRAS.
    
    ESTRICTAMENTE: 
    - Devuelve SOLO texto plano y corrido (sin títulos ni capítulos).
    - NO dejes renglones vacíos innecesarios.

    --- PERSONAJES (REGLA DE ORO) ---
    Los ÚNICOS viajeros son: ${characters.filter(c => c.name && c.role).map(c => `${c.name} (${c.role})`).join(", ")}.
    
    PROHIBIDO: 
    - NO inventes un conductor, chofer o guía.
    - NO agregues padres, abuelos o mascotas si no están en la lista de arriba.
    - El auto se maneja solo o lo maneja uno de los personajes listados si es adulto. NADIE MÁS sube al auto.

    --- ELEMENTOS ---
    Auto: Renault ${selectedCar}.
    Tema: ${randomTheme}.

    --- HISTORIA (Fluida y de un tirón) ---
    Empieza en Uruguay, un día lindo. Suben al Renault ${selectedCar} (describe su confort tiene que girar en torno a esto el principio). Al arrancar, el paisaje cambia mágicamente y entran al mundo de "${randomTheme}".
    
    Viven una aventura donde tienen que resolver un problema. puedes usar algo del auto para resolverlo o no.
    
    Terminan volviendo a casa felices.

    REGLAS DE CIERRE (CRÍTICO)
    - El texto debe terminar ESTRICTAMENTE con el punto final de la historia.
    - NO agregues preguntas al lector como "¿Te gustó?" o "¿Querés otro?".
    - NO agregues notas del autor ni despedidas.
    - NO uses emojis.

    --- TONO ---
    Lenguaje rioplatense tierno ("bo", "che", "gurises"). Emocionante y sensorial.
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