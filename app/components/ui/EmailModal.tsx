interface EmailModalProps {
    email: string;
    setEmail: (email: string) => void;
    onSave: () => void;
    onCancel: () => void;
    isSaving: boolean;
}

export const EmailModal = ({
    email,
    setEmail,
    onSave,
    onCancel,
    isSaving,
}: EmailModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Guardar tu cuento
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                    Ingresa tu email para recibir el cuento y novedades.
                </p>

                <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600 text-black"
                />

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700 font-medium cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="bg-[var(--color-brand-pink,#E91E63)] text-white px-6 py-2 rounded-full font-medium hover:bg-pink-600 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {isSaving ? "Enviando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
};
