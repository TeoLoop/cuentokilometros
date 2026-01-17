import { ChevronDown } from "lucide-react";

interface CharacterInputProps {
  id: number;
  name: string;
  role: string;
  onChange: (id: number, field: "name" | "role", value: string) => void;
  index: number;
}

const ROLES = [
  "Papá",
  "Mamá",
  "Hijo",
  "Hija",
  "Abuelo",
  "Abuela",
  "Amigo",
  "Amiga",
];

export function CharacterInput({
  id,
  name,
  role,
  onChange,
  index,
}: CharacterInputProps) {
  return (
    <div className="flex flex-col gap-1 w-full max-w-sm">
      <label className="text-white font-medium text-xs md:text-lg text-center drop-shadow-md">
        Personaje {index + 1}
      </label>
      <div className="flex flex-row md:flex-col gap-2">
        {/* Name Input */}
        <div className="relative w-full flex-1 md:flex-none">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => onChange(id, "name", e.target.value)}
            className="w-full pl-3 pr-3 py-1.5 md:py-2 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-md text-center text-base md:text-base"
          />
        </div>

        {/* Role Select */}
        <div className="relative w-full flex-1 md:flex-none">
          <select
            value={role}
            onChange={(e) => onChange(id, "role", e.target.value)}
            className="w-full pl-3 pr-6 py-1.5 md:py-2 rounded-lg bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-md text-center cursor-pointer text-base md:text-base"
          >
            <option value="" disabled>
              Seleccionar rol
            </option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}