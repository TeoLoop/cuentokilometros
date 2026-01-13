import { ValidationError } from "@/app/types";

interface ValidationModalProps {
    errors: ValidationError[];
    onDismiss: () => void;
}

export const ValidationModal = ({ errors, onDismiss }: ValidationModalProps) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-bounce-in border-l-4 border-[var(--color-brand-pink,#E91E63)]">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                    ¡Faltan algunos detalles!
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                    Para que el cuento quede genial, completa la información faltante:
                </p>

                <div className="max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
                    {errors.map((error, idx) => (
                        <div
                            key={idx}
                            className="bg-gray-100 p-3 rounded-lg mb-3 text-sm text-gray-700 border border-gray-200"
                        >
                            {error.missingField === "name" ? (
                                <>
                                    Rol: <span className="font-semibold">{error.currentRole}</span>
                                    <br />
                                    <span className="text-red-500 font-medium">
                                        ⚠️ Falta el Nombre
                                    </span>
                                </>
                            ) : (
                                <>
                                    Nombre:{" "}
                                    <span className="font-semibold">{error.currentName}</span>
                                    <br />
                                    <span className="text-red-500 font-medium">
                                        ⚠️ Falta el Rol
                                    </span>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={onDismiss}
                        className="bg-[var(--color-brand-pink,#E91E63)] text-white px-6 py-2 rounded-full font-medium hover:bg-pink-600 transition-colors shadow-lg cursor-pointer"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};
