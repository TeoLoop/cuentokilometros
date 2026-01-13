"use client";

import Image from "next/image";
import styles from "./Home.module.css";
import { useStoryApp } from "@/app/hooks/useStoryApp";
// Components
import { HeroSection } from "@/app/components/sections/HeroSection";
import { StoryFormSection } from "@/app/components/sections/StoryFormSection";
import { ResultCard } from "@/app/components/ui/ResultCard";
import { LoadingOverlay, EmailModal, ValidationModal } from "@/app/components/ui/Modals";

export default function Home() {
  const {
    characters,
    selectedCar,
    isLoading,
    story,
    audioSrc,
    showEmailModal,
    email,
    isSavingEmail,
    validationErrors,
    handleCharacterChange,
    addCharacter,
    removeCharacter,
    setSelectedCar,
    handleGenerate,
    handleSaveEmail,
    setEmail,
    setShowEmailModal,
    setValidationErrors,
  } = useStoryApp();

  return (
    <>
      {/* Desktop Background - GLOBAL FIXED */}
      <div className={styles.desktopBgContainer}>
        <Image
          src="/images/backgrounds/landing-desktop.jpg"
          alt="Background"
          fill
          // Nota: El object-position: bottom está forzado en el CSS ahora
          className="object-cover"
          priority
          quality={100}
          sizes="(max-width: 768px) 1vw, 100vw"
        />
      </div>

      {/* AQUÍ aplicamos la clase mainResponsive para achicar la UI en notebooks */}
      <main
        className={`${styles.mainResponsive} h-screen overflow-y-auto md:h-auto md:overflow-visible snap-y snap-mandatory scroll-smooth relative flex flex-col items-center`}
      >
        <HeroSection
          onStartClick={() => {
            document
              .getElementById("create-story-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        <StoryFormSection
          characters={characters}
          selectedCar={selectedCar}
          isLoading={isLoading}
          onCharacterChange={handleCharacterChange}
          onAddCharacter={addCharacter}
          onRemoveCharacter={removeCharacter}
          onSelectCar={setSelectedCar}
          onGenerate={handleGenerate}
        >
          {/* Result Card Injection */}
          {story && audioSrc && (
            <ResultCard
              story={story}
              audioSrc={audioSrc}
              onOpenEmailModal={() => setShowEmailModal(true)}
            />
          )}
        </StoryFormSection>
      </main>

      {/* --- Modals --- */}
      {isLoading && <LoadingOverlay />}

      {showEmailModal && (
        <EmailModal
          email={email}
          setEmail={setEmail}
          onSave={handleSaveEmail}
          onCancel={() => setShowEmailModal(false)}
          isSaving={isSavingEmail}
        />
      )}

      {validationErrors && validationErrors.length > 0 && (
        <ValidationModal
          errors={validationErrors}
          onDismiss={() => setValidationErrors(null)}
        />
      )}
    </>
  );
}
