# 🚗 Cuento Kilómetros

**Cuento Kilómetros** is an interactive web experience for Renault, allowing users to generate personalized stories based on their family characters and chosen vehicle.

![Project Banner](/images/backgrounds/landing-desktop.jpg)

## ✨ Features

- **Interactive Character Input**: Add family members with names and roles (Papá, Mamá, Hijo, etc.).
- **Vehicle Selection**: Browse and select from a range of Renault vehicles (Arkana, Duster, Kangoo, etc.).
- **AI Story Generation**: Generates a unique, personalized story for children using **Google Gemini 2.5 Flash** based on the selected characters and vehicle.
- **AI Audio Narration**: Converts the generated story into natural-sounding speech using **ElevenLabs Text-to-Speech**.
- **Email Collection**: Integrates directly with **Google Sheets** to seamlessly save user emails for follow-up and lead generation.
- **Responsive Design**:
  - **Desktop**: Immersive single-page experience with high-quality visuals.
  - **Mobile**: Optimized split-screen layout with scroll-nap transitions and touch-friendly controls.
- **Visual Effects**: Smooth animations, glassmorphism UI, and efficient image loading.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Fredoka](https://fonts.google.com/specimen/Fredoka)
- **AI & Integrations**:
  - `@google/generative-ai` (Gemini API)
  - `elevenlabs` (TTS API)
  - `google-spreadsheet` & `google-auth-library` (Google Sheets Integration)

## 📋 Environment Variables

To run this project locally, you must create a `.env.local` file in the root directory and configure the following variables:

```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# ElevenLabs API
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Google Service Account (Google Sheets API)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="your_private_key" # Support multiline strings
GOOGLE_SHEET_ID=your_google_sheet_id
```

## 🚀 Getting Started

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/your-repo/cuentokilometros.git
    cd cuentokilometros
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create `.env.local` using the structure described above.

4.  **Run the development server**:

    ```bash
    npm run dev
    ```

5.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```bash
app/
├── api/               # Backend API Routes
│   ├── generate-audio/
│   ├── generate-story/
│   └── save-email/
├── components/        # UI and feature components
│   └── landing/       # Core landing page components
│       ├── CarSelector.tsx
│       └── CharacterInput.tsx
├── layout.tsx         # Root layout with font configuration
├── page.tsx           # Main application logic and layout
└── globals.css        # Global styles and animations
lib/                   # External API services
├── elevenlabs.ts      # ElevenLabs TTS integration
└── gemini.ts          # Google Gemini generative AI text integration
public/
├── images/            # Static assets (backgrounds, cars, UI)
```

## 🎨 Design Decisions

- **Mobile First**: The mobile experience is split into two distinct "screens" (Intro & Form) using scroll snapping for a native app feel.
- **Performance**: Images are optimized with `sizes` props and high-quality settings to ensure crisp visuals on all devices without layout shifts.
- **Aesthetics**: A cohesive color palette (`#E91E63` for accents) and rounded UI elements create a friendly, modern look.
- **AI Integration**: Backend routes handle AI and Google Sheets requests securely, ensuring API keys are not exposed to the client.

---

<p align="center">
  Built with ❤️ for Renault
</p>
