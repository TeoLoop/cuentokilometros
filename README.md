# 🚗 Cuento Kilómetros

**Cuento Kilómetros** is an interactive web experience for Renault, allowing users to generate personalized stories based on their family characters and chosen vehicle.

![Project Banner](/images/backgrounds/landing-desktop.jpg)

## ✨ Features

- **Interactive Character Input**: Add family members with names and roles (Papá, Mamá, Hijo, etc.).
- **Vehicle Selection**: Browse and select from a range of Renault vehicles (Arkana, Duster, Kangoo, etc.).
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

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```bash
app/
├── components/
│   └── landing/       # Core landing page components
│       ├── CarSelector.tsx
│       └── CharacterInput.tsx
├── layout.tsx         # Root layout with font configuration
├── page.tsx           # Main application logic and layout
└── globals.css        # Global styles and animations
public/
├── images/            # Static assets (backgrounds, cars, UI)
```

## 🎨 Design Decisions

- **Mobile First**: The mobile experience is split into two distinct "screens" (Intro & Form) using scroll snapping for a native app feel.
- **Performance**: Images are optimized with `sizes` props and high-quality settings to ensure crisp visuals on all devices without layout shifts.
- **Aesthetics**: A cohesive color palette (`#E91E63` for accents) and rounded UI elements create a friendly, modern look.

---

<p align="center">
  Built with ❤️ for Renault
</p>
