<div align="center">

# ⚡ GitPulse — GitHub Profile Summary & Analytics

### *A modern, interactive profile visualizer, developer analytics suite, and card generator for GitHub.*

[![Live Demo](https://img.shields.io/badge/demo-online-emerald.svg?style=for-the-badge&logo=vercel)](https://bradleyjoejoseph.github.io/github-profile-summary/)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg?style=for-the-badge&logo=vite)](https://vite.dev/)

[**Explore Live Demo »**](https://bradleyjoejoseph.github.io/github-profile-summary/)

---

</div>

## 💡 Motivation

The classic [profile-summary-for-github](https://github.com/tipsy/profile-summary-for-github) was an iconic tool that thousands of developers used to visualize their open-source contributions. Over the years, however, web standards and visualization aesthetics evolved dramatically.

I built **GitPulse** to be the next-generation reimagining: a fast, client-side, zero-backend dashboard loaded with interactive charts, dark/midnight/light modes, head-to-head developer comparison, rate limit intelligence, and exportable profile cards for READMEs.

---

## ✨ Features

- 👤 **Executive Profile Hero**: High-res avatar glow, bio, location, company, member tenure, hireability badge, and follower metrics.
- 📊 **Key Metric KPIs**: Real-time aggregation of total stars earned, forks count, original vs forked repository ratios, and community standing.
- 🎨 **Language Analytics**:
  - Donut & progress chart of **Languages by Repository Count**.
  - Donut & progress chart of **Languages by Stars Earned** (identifying which languages yield the highest community adoption).
  - Official GitHub language palette with 100+ color mappings.
- 🏆 **Repository Impact Ranking**: Ranked bar charts showcasing top projects by stars and forks.
- ⏰ **Activity Cadence & Productivity Clock**:
  - **Day-of-Week Cadence**: Identifies peak contribution days.
  - **24-Hour Productivity Clock**: Determines developer archetypes (*"Night Owl"*, *"Morning Bird"*, or *"Afternoon Architect"*).
- 🗂️ **Live Repository Explorer**: Instant client-side search, filtering by language (TypeScript, Python, etc.) and type (Sources vs Forks), and multi-criteria sorting.
- ⚔️ **Developer Versus Mode**: Side-by-side comparison of any two developers with head-to-head stat bars and confetti celebrations.
- 🎴 **Exportable Profile Summary Card**: Generate Retina high-DPI cards ready to download as PNG or embed directly in GitHub profile READMEs.
- 🌓 **Multi-Theme Engine**: Seamless switching between **GitHub Dark**, **AMOLED Midnight**, **GitHub Dimmed**, and **Crisp Light** modes.
- ⚡ **Rate-Limit Guard & Caching**: Smart 15-minute `localStorage` cache, live rate-limit quota counter, and optional Personal Access Token support for 5,000 req/hr.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Exporting**: [html-to-image](https://github.com/bubkoo/html-to-image)
- **Effects**: [canvas-confetti](https://github.com/catdad/canvas-confetti)
- **Deployment**: [GitHub Actions & GitHub Pages](https://pages.github.com/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/bradleyjoejoseph/github-profile-summary.git
cd github-profile-summary

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🔑 GitHub API Token (Optional)

By default, GitPulse connects to the official unauthenticated GitHub REST API (limited to 60 requests/hour per IP). 

If you are analyzing dozens of profiles, you can click the **API Key** button in the navigation bar and enter a GitHub Personal Access Token. 

> [!NOTE]
> **100% Client-Side Privacy**: Tokens are stored strictly in your browser's `localStorage` and sent directly to `api.github.com`. No backend server exists, and no permissions or scopes are required for reading public repositories.

---

## 📦 Building for Production

```bash
# Type check and bundle for production
npm run build

# Preview production build locally
npm run preview
```

The compiled assets will be in the `dist/` directory, ready to be deployed to GitHub Pages, Vercel, or Netlify.

---

## 👤 Author

**Bradley Joseph**
- GitHub: [@bradleyjoejoseph](https://github.com/bradleyjoejoseph)
- Portfolio: [bradleyjoejoseph.github.io](https://bradleyjoejoseph.github.io/)
- University of York — Computer Science with AI

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
