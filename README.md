# 📚 StudyClub — Collaborative Learning & Productivity Platform

**Learn together. Stay focused. Achieve more.**

StudyClub is a web-based learning and productivity platform designed to help students study efficiently, collaborate with friends, organize academic tasks, and use AI-powered tools to make learning easier.

It combines virtual study clubs, an AI study assistant, a Pomodoro timer, a task planner, a calendar, and digital notes in one application.

## 🎯 Problem Statement

Students often use different applications for taking notes, managing assignments, tracking study time, preparing for exams, and collaborating with classmates.

Switching between these tools can make studying less organized and productive.

StudyClub addresses this problem by bringing essential study and productivity features together in one platform.

## ✨ Key Features

### 🔐 1. User Authentication

- Create an account using your name, email, password, and academic details.
- Sign in to access the application.
- Maintain a user session.
- Protect selected pages from unauthorized access.
- Sign out when finished.

### 👥 2. Collaborative Study Clubs

- Create a study club for a subject or topic.
- Join an existing club using a unique six-digit code.
- Collaborate with other students in a shared study environment.
- Use group chat to discuss topics and share learning resources.
- View leaderboards for study activity and quiz performance.

### 🎥 3. Virtual Study Rooms

- View a virtual room with participant cards.
- Toggle simulated microphone and camera controls.
- Display study statuses such as Studying, Break, and Lo-Fi Focus.
- Create a more engaging online group-study experience.

*Note: The participant grid and camera or microphone controls are simulated unless actual video and audio communication services are integrated.*

### 🤖 4. AI Study Assistant

StudyClub integrates Google Gemini AI to support learning.

- **AI Tutor:** Ask questions and get explanations of difficult concepts.
- **Flashcard Generator:** Generate question-and-answer cards for revision.
- **Quiz Generator:** Create multiple-choice questions and check your answers.
- **Note Summarizer:** Convert lengthy study notes into concise summaries.
- **Study Guide:** Organize important concepts, definitions, and revision material.

The application also includes a local fallback response mechanism when the AI service is unavailable or not configured.

### ⏱️ 5. Pomodoro Focus Timer

The Pomodoro technique divides study time into focused sessions with breaks.

StudyClub includes:

- 25-minute focus sessions.
- 5-minute short breaks.
- 15-minute long breaks.
- A timer that continues across page navigation.
- Animated audio visualizations during focus sessions.
- Ambient study sounds, such as rain, café ambience, and lo-fi music.

These features help students maintain concentration and develop consistent study habits.

### 📅 6. Study Planner and Task Management

- Add academic tasks and assignments.
- Organize tasks into To Do, In Progress, and Completed.
- Assign priority levels.
- Track upcoming deadlines.
- Schedule exams, classes, and group-study sessions.

### 📝 7. Digital Notes Library

- Create and organize study notes.
- Categorize notes using tags.
- Search for saved notes.
- Use Markdown formatting to structure learning material.

### 🎨 8. User Interface and Themes

- Responsive web interface.
- Dark mode and light mode.
- Animated interface elements.
- Glassmorphism-inspired styling.
- Icons, notifications, and interactive components.

## 🔄 How StudyClub Works

1. **Register or sign in:** Create an account and access your study dashboard.
2. **Organize your learning:** Create or join a study club for your subject.
3. **Study with focus:** Use the Pomodoro timer to manage study sessions and breaks.
4. **Learn with AI:** Ask questions, summarize notes, generate flashcards, and practice quizzes.
5. **Manage academic work:** Add assignments, plan deadlines, and organize notes.
6. **Collaborate and track progress:** Participate in club activities and review available study statistics.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React 18 | Builds the interactive user interface |
| React Router v6 | Handles navigation between pages |
| Vite 5 | Runs the development server and builds the application |
| CSS | Styles the application and supports themes |
| Supabase | Provides authentication and PostgreSQL database services when configured |
| Google Gemini AI | Generates AI-powered learning assistance |
| Lucide Icons | Provides interface icons |
| Framer Motion | Adds animations |
| React Hot Toast | Displays user notifications |
| localStorage | Supports persistent local data and fallback functionality |

## 🧠 How the Main Technologies Work Together

- **React:** Displays pages and updates the interface when users interact with the application.
- **React Router:** Navigates between the dashboard, study clubs, planner, and AI assistant.
- **Supabase:** Can store user and application data in a PostgreSQL database and manage authentication.
- **Google Gemini AI:** Processes prompts to generate educational explanations, summaries, flashcards, and quizzes.
- **localStorage:** Stores supported data in the browser so it can persist across page reloads.
- **Vite:** Provides a fast local development environment and production build tools.

## 📁 Project Structure

```text
StudyClub/
├── package.json
├── StudyClub-main/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── services/
│       │   ├── db.js
│       │   ├── aiService.js
│       │   └── supabaseClient.js
│       ├── index.css
│       └── App.jsx
└── README.md
```

**Folder overview:**

- `components/` — Reusable interface components such as headers and modals.
- `contexts/` — Shared application state for authentication, clubs, themes, and the Pomodoro timer.
- `pages/` — Main application screens.
- `services/db.js` — Database and local data operations.
- `services/aiService.js` — AI-related operations and fallback logic.
- `services/supabaseClient.js` — Supabase client configuration.
- `App.jsx` — Application routing and shared providers.
- `index.css` — Global styling and design system.

## ⚙️ Installation and Setup

### Prerequisites

Install the following:

- Node.js version 18 or higher.
- npm.
- A code editor such as Visual Studio Code.

### Step 1: Clone the repository

```bash
git clone https://github.com/shreya-s-f/StudyClub.git
cd StudyClub
```

### Step 2: Install dependencies

If the root `package.json` provides scripts that manage the application, use its instructions. Otherwise, navigate into the application folder:

```bash
cd StudyClub-main
npm install
```

### Step 3: Configure environment variables

Create a `.env` file in the application directory if your project uses environment variables.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Replace the example values with your own credentials.

- Supabase credentials are needed for the configured Supabase features.
- A Gemini API key is needed for live AI generation.
- The application may support local fallback functionality when these services are not configured.

**Security note:** Never commit real API keys or secret credentials to a public repository. Use environment variables and appropriate service-side restrictions.

### Step 4: Start the application

```bash
npm run dev
```

Open the local URL shown in the terminal. With the default Vite configuration, it is usually:

`http://localhost:5173`

### Step 5: Create a production build

```bash
npm run build
```

Vite generates the production-ready files according to the project configuration.

## 🌍 Real-World Applications

StudyClub can be useful for:

- College students preparing for examinations.
- Friends organizing group-study sessions.
- Students practicing quizzes and revising with flashcards.
- Learners managing assignments and academic deadlines.
- Study groups sharing knowledge and learning resources.

## 🚀 Future Enhancements

- Real-time video and audio study rooms.
- Live collaborative note editing.
- Calendar synchronization.
- More detailed study analytics.
- Personalized AI-generated study plans.
- Push notifications for upcoming deadlines.
- Additional accessibility and language options.

## 💡 Benefits

- Brings study tools together in one place.
- Encourages focused study habits.
- Helps students organize assignments and deadlines.
- Supports collaborative learning.
- Uses AI to assist with revision and concept understanding.
- Provides a structured environment for academic productivity.

## 👩‍💻 Author

**Shreya Suresh Fakirapur**

GitHub: [@shreya-s-f](https://github.com/shreya-s-f)

Project Repository: [StudyClub](https://github.com/shreya-s-f/StudyClub)

## 📄 License

This project is distributed under the MIT License. See the `LICENSE` file in the repository for the full terms.

---

**Study smarter, stay consistent, and grow together! 🚀📚**
