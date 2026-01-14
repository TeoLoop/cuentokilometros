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
    Actúa como un cuentacuentos uruguayo con lenguaje infantil y con mucha imaginación para niños.
    Escribe un cuento de AL MENOS 300 PALABRAS.

    --- DATOS DEL VIAJE ---
    1. PROTAGONISTAS: ${characters
      .filter((c) => c.name.trim() && c.role.trim())
      .map((c) => `${c.name} (${c.role})`)
      .join(", ")} (No menciones conductores ni otros personajes que no aparecen en la lista).
    2. VEHÍCULO MÁGICO: Un Renault ${selectedCar}.
    3. TEMÁTICA DEL CUENTO: ${randomTheme}.

    --- INSTRUCCIONES DE ESTILO ---
    1. TONO RIOPLATENSE: Usa palabras nuestras como "auto", "valija", "lindo", "che", "bo", "gurises" (sin exagerar, que sea tierno).
    2. EL AUTO: El Renault ${selectedCar} debe transformarse según la temática (se tiene que tratar tambien del auto el cuento) (ej: si es mar, se hace submarino; si es espacio, nave espacial), pero manteniendo que es un Renault seguro y cómodo.
    3. ESTRUCTURA:
       - Inicio: Suben al auto en Uruguay y algo mágico pasa al arrancar.
       - Nudo: Exploran el mundo de "${randomTheme}". Pasan algo divertido o asombroso.
       - Desenlace: Vuelven a casa seguros y felices.
    4. RITMO: Usa puntuación clara (puntos y comas) para que la narración sea pausada.

    --- FORMATO ---
    Devuelve SOLO el texto del cuento, sin títulos ni introducciones.
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