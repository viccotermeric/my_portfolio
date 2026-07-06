# Rishabh Trivedi

An interactive, terminal-inspired portfolio website built with React and Tailwind CSS. 

![Portfolio Front Page](public/og-image.png)

## Features
- **Terminal Interface**: A simulated command-line environment that handles typical terminal commands (`about`, `projects`, `skills`) alongside simple natural language questions.
- **GUI Toggle**: A fallback graphical user interface for users who prefer standard web navigation.
- **Responsive System**: Scales down appropriately for mobile screens using standard Tailwind container rules.

## Tech Stack
- Frontend: React (Vite)
- Styling: Tailwind CSS v4
- Deployment: Vercel

## Local Development
To run this project locally:

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Architecture
This application is completely static. All project and experience data is stored in a structured javascript object (`portfolio-data.js`). The terminal engine parses input, maps it against predefined intents, and streams the output to the DOM to simulate natural typing. External network requests are limited strictly to client-side fetches for localized weather status (via Open-Meteo & GeoJS).
