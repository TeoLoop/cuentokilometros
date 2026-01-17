interface ResultCardProps {
    story: string;
    audioSrc: string;
    onOpenEmailModal: () => void;
}

export const ResultCard = ({
    story,
    audioSrc,
    onOpenEmailModal,
}: ResultCardProps) => {
    return (
        <div className="w-full max-w-2xl mt-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white z-10 animate-fade-in-up">
            <h3 className="text-xl font-bold mb-4 text-center">
                ¡Tu cuento está listo!
            </h3>

            <div className="w-full mb-6 flex justify-center">
                {audioSrc ? (
                    <audio controls src={audioSrc} className="w-full" autoPlay />
                ) : (<div className="text-white/50 text-sm animate-pulse">Cargando audio...</div>)}
            </div>

            <div className="max-h-60 overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
                <p className="whitespace-pre-wrap text-base md:text-xl leading-loose">{story}</p>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={onOpenEmailModal}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-lg cursor-pointer"
                >
                    Descargar / Guardar
                </button>
            </div>
        </div>
    );
};
