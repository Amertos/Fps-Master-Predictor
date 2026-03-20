<div align="center">
  <img src="https://picsum.photos/seed/fps-predictor/200/200" alt="FPS Master Predictor Logo" width="120" style="border-radius: 20px; box-shadow: 0 0 20px rgba(0, 255, 65, 0.4);" />

  <h1>🚀 FPS Master Predictor</h1>
  <p><strong>A Next-Gen Performance Estimator for Modern PC Gaming.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" alt="TypeScript" />
  </p>
  
  <p><em>Predict your PC's framerate, analyze hardware bottlenecks, and optimize settings before you even launch the game.</em></p>
  
  <h3>✨ Made by Amer ✨</h3>
</div>

<hr />

## 🌟 Features

*   **🎯 Precision FPS Calculations**: Get highly accurate FPS estimates based on CPU and GPU computational scores and game engine requirements.
*   **🔍 Bottleneck Analysis**: Automatically detects if your CPU or GPU is holding your system back with visual progress bars.
*   **💎 System Tier Rating**: Classifies your build from "Potato" to "God Tier" depending on the overall synergy.
*   **📈 Smart Comparisons**: Visual bar charts show how changing the resolution, preset, or upgrading the GPU affects your framerate.
*   **💾 Build Storage & Comparison**: Save multiple PC builds to `localStorage` and view head-to-head comparisons to see which configuration is faster.
*   **📱 Fully Responsive & SEO Optimized**: Fluid UI built with Tailwind CSS that works flawlessly on mobile, tablet, and desktop, coupled with a deep JSON-LD structured layout for Google Search bots.

## 🛠️ Tech Stack

This project was completely refactored into a high-quality, production-ready architecture:

*   **Framework**: [Next.js](https://nextjs.org/) (App Directory)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YourUsername/fps-master-predictor.git
   cd fps-master-predictor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Architecture

The massive initial codebase was extracted into clean, single-responsibility modules:
*   `lib/fps-engine.ts` - Pure calculation logic, isolated from React components.
*   `lib/types.ts` - Highly rigid interface definitions ensuring type safety.
*   `hooks/` - Contains all derived state logic (`useFpsResult.ts`) and side effects (`useBuilds.ts`).
*   `components/` - Focused dummy components receiving props (`FpsDisplay.tsx`, `BottleneckCard.tsx`, etc.).

---
<div align="center">
  <p>Engineered with performance and aesthetics in mind. <br/> <strong>Made by Amer</strong> © 2026</p>
</div>
