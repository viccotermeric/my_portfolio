# Rishabh Trivedi - Interactive Terminal Portfolio

Welcome to my personal developer portfolio! This is an interactive, terminal-style web application built to showcase my backend engineering, data architecture, and full-stack projects. The interface mimics a real command-line environment, providing a unique and engaging way for recruiters and peers to interface with my work.

![Portfolio Front Page](public/og-image.png)

## 🚀 Features
- **Authentic Terminal Emulation**: Execute commands like `about`, `projects`, `skills`, and `education` to interact with the system naturally.
- **Conversational Intent Handling**: Ask plain English questions like *"Who are you?"*, *"What are your career goals?"*, and *"Why did you choose Data Architecture?"* and the terminal will respond intelligently.
- **GUI Mode Toggle**: For those who prefer a traditional website, click the profile badge in the top right to instantly swap to a standard graphical user interface.
- **Fully Responsive**: Built with granular Tailwind breakpoints to look pixel-perfect on massive widescreen monitors and seamlessly wrap on small mobile devices.

## 🛠️ Technology Stack
This project leverages modern frontend capabilities heavily optimized for a fast, static-served environment without expensive backend calls:
- **Core Framework**: [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for blazing-fast component rendering and isolated deployment hooks.
- **Styling Engine**: [Tailwind CSS](https://tailwindcss.com/) handling rigorous container scaling (`max-w-[85vw]`), absolute element positioning, and dark mode native integration.
- **State Management**: Advanced utilization of React Hooks (`useState`, `useEffect`, `useRef`) for tracking simulated terminal history, parsing markdown DOM inputs, and regulating timing functions (like the simulated boot sequence).
- **Data Source**: Statically mapped Javascript objects (`portfolio-data.js`) replacing external database queries to guarantee instantaneous load performance.
- **Live Integrations**: Implements asynchronous fetch APIs referencing `GeoJS` (for IP location targeting) and `Open-Meteo` (for localized dynamic weather telemetry) on the primary status bar.

## ⚙️ Local Development
To launch the deployment server and test changes locally, run the following:
```bash
npm install
npm run dev
```

## 🌐 Deployment Pipeline
The application requires zero isolated backend servers. The `main` branch is actively hooked to **Vercel** architecture—every push triggers a direct, headless pipeline build executing `vite build` into a robust `dist` directory. I have stripped all secondary CI/CD scripts (like GitHub Pages workflows or Vercel serverless `.json` directives) to enforce a flawless static deployment lifecycle.
