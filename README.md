# GitHub Data Visualizer 🚀

A stunning, premium web application built with React and Vite that allows users to instantly generate beautiful, dynamic, and unique visualizations of their public GitHub data.

![GitHub Visualizer Demo Screenshot](https://raw.githubusercontent.com/Toumari/Github-Visualiser/master/public/vite.svg) {/* Replace with a real screenshot of your app once hosted! */}

## ✨ Features

- **Premium Glassmorphic Design**: Built from scratch using modern vanilla CSS to ensure a responsive, translucent, and vibrant aesthetic without relying on heavily opinionated frameworks.
- **Language Galaxy**: A gorgeous custom Recharts pie graph outlining the developer’s most utilized languages across all their repositories.
- **Activity Rhythm**: Analyzes a user's recent commit timestamps to visually plot out an area graph of their coding hours and assign fun developer "personas" like "Night Owl" or "Morning Person."
- **Developer Titles**: An algorithmic ranking applied to your profile based on GitHub tenure, total stars earned, and commit velocity (e.g., "Open Source Legend").
- **Highest Impact Repositories**: A quick-scan view of your most starred and forked projects.

## 🛠️ Tech Stack

- **Framework**: React 19 (via Vite)
- **Styling**: Vanilla CSS (CSS variables, flexbox/grid, glassmorphism)
- **Visuals**: `recharts` for scalable vector graphs, `framer-motion` for buttery smooth staggered micro-animations.
- **Icons**: `lucide-react`
- **Testing**: `vitest`

## 🚀 Getting Started

To run this application locally, you will need Node.js installed on your machine.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Toumari/Github-Visualiser.git
   cd Github-Visualiser
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **View in browser:**
   Open [http://localhost:5173/](http://localhost:5173/) to see the visualizer.

## 🧪 Running Tests

This project includes a suite of unit tests for the data processing utilities and the GitHub API services.

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📝 Usage Notes

- The app uses the **public** GitHub REST API.
- Because it operates without authentication, it is subject to the standard GitHub API rate limit (60 requests per hour per IP). If nothing loads, you may have briefly hit this cap!
