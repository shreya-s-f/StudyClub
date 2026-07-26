# 📚 StudyClub — Collaborative Learning & Productivity Platform

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**StudyClub** is a modern, feature-rich web application designed for students and study groups to collaborate in virtual study rooms, track Pomodoro focus sessions, generate AI study materials (flashcards, quizzes, summaries), and organize academic tasks.

---

## ✨ Features Highlight

### 🔐 1. Complete Authentication System
- **Sign Up**: Register with Full Name, Email, Password, and Major/Branch (*Computer Science, Quantum Physics, Pre-Med, Engineering, Business*).
- **Sign In**: Secure credential validation with persistent user session management.
- **Header Sign Out**: Prominent Sign Out control located in the top-right header bar.
- **Protected Routes**: Restricts unauthorized access to dashboard and study tools.

### 👥 2. Collaborative Study Clubs & Virtual Study Rooms
- **Club Management**: Create new study clubs with auto-generated 6-digit join codes or join existing clubs.
- **Live Virtual Study Room**: Simulated video/audio participant grid with mute/unmute, camera toggles, and real-time focus status tags (*Studying, Lo-Fi Focus, Break*).
- **Club Group Chat**: Real-time message board for group discussions and resource sharing.
- **Club Leaderboard**: Ranked leaderboard for study hours, completed pomodoros, and quiz performance.

### 🤖 3. AI Study Companion (Powered by Google Gemini AI)
- **AI Tutor Chat**: Interactive Q&A for explaining complex concepts, solving step-by-step equations, and formatting markdown study guides.
- **3D Flashcard Deck Generator**: Input any topic or text to generate flashcard decks with an interactive 3D card flip viewer and self-rating.
- **Interactive Quiz Master**: Generate 5-question multiple choice quizzes with instant grading, explanations, and score tracking.
- **Note Summarizer & Smart PDF Reader**: Transform raw lecture notes into bulleted summaries, key terminology, and mind map outlines.

### ⏱️ 4. Pomodoro Focus & Ambient Audio Suite
- **Persistent Global Timer**: 25/5/15 minute focus cycles that continue running seamlessly across page navigation.
- **Live Audio Visualizer**: Dynamic animated waveform visualizer in the top header during active focus sessions.
- **Ambient Soundscapes**: Selectable background study audio (*Gentle Rain, Lo-Fi Beats, Cafe Ambience*).

### 📅 5. Planner, Task Kanban & Notes Hub
- **Interactive Task Kanban**: Categorize tasks under *To Do*, *In Progress*, and *Completed* with priority tags.
- **Study Calendar**: Schedule exams, classes, group study sessions, and deadlines.
- **Markdown Notes Library**: Searchable study notes hub with tagging and categorization.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Lucide Icons, Framer Motion, React Hot Toast
- **Build Tool & Bundler**: Vite 5
- **Styling**: Vanilla CSS with HSL design tokens, Glassmorphism, Dark/Light mode theme switching
- **Backend & Database**: Hybrid Service Layer — Supabase PostgreSQL Database / Auth with `localStorage` persistent seed fallback
- **AI Integration**: Google Gemini API (`@google/generative-ai` REST endpoint) + Smart local fallback response engine

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/StudyClub.git
cd StudyClub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Setup
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```
*(Note: If API keys are omitted, StudyClub automatically runs using local storage database mode and built-in AI engine!)*

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Build for Production
```bash
npm run build
```

---

## 📁 Directory Structure

```
StudyClub/
├── package.json               # Root delegate scripts
├── StudyClub-main/            # Core application source
│   ├── src/
│   │   ├── components/        # Layout, Header, Badges Modal
│   │   ├── contexts/          # AuthContext, ClubContext, PomodoroContext, ThemeContext
│   │   ├── pages/             # Dashboard, StudyClub, AIAssistant, Planner, Auth
│   │   ├── services/          # db.js, aiService.js, supabaseClient.js
│   │   ├── index.css          # Design system & utility classes
│   │   └── App.jsx            # Application routing & providers
│   ├── public/                # Static assets & icons
│   ├── index.html             # HTML entry point
│   ├── vite.config.js         # Vite configuration
│   └── package.json           # Application dependencies
└── README.md
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
