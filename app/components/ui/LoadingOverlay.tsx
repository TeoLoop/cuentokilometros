import Image from "next/image";

export const LoadingOverlay = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#6b26ff]/90 backdrop-blur-sm">
            <div className="relative w-32 h-32 animate-pulse">
                <Image
                    src="/images/ui/renault-logo.svg"
                    alt="Loading"
                    fill
                    className="object-contain"
                />
            </div>
            <p className="text-white text-xl mt-4 font-medium animate-bounce">
                Generando tu historia...
            </p>
        </div>
    );
};
