# 📖 StudyClub — Complete Project Overview & Guide
> **Everything you need to know about StudyClub explained in simple, friendly English.**

---

## 🌟 1. Executive Summary

**StudyClub** is an all-in-one web platform designed for students, study groups, and self-learners. It brings together virtual study rooms, an AI homework helper, a Pomodoro focus timer, a visual assignment planner, and gamified study streaks into **one single browser window**.

- **Goal:** Stop students from having to switch between 5 different apps (Zoom, Discord, ChatGPT, Quizlet, and Todoist) just to complete their daily study goals.
- **Target Audience:** College students, high schoolers, coding bootcamps, and academic clubs.
- **Platform Version:** 2.0.0 PRO

---

## ❓ 2. The Problem We Solved

### The Pain Point
Every day, a student studying for an exam usually has to open:
1. **A video call app** (Zoom or Discord) to study with friends.
2. **A notes app** (Notion or Google Docs) to review lecture summaries.
3. **An AI chatbot** (ChatGPT) to ask questions when stuck.
4. **A flashcard app** (Quizlet or Anki) to test their memory.
5. **A timer app** to do 25-minute Pomodoro study sprints.
6. **A to-do list** (Todoist or Apple Notes) to track deadlines.

Constantly switching back and forth between all these tabs causes distraction, lost focus, and cognitive overload.

### The StudyClub Solution
StudyClub integrates **all 7 essential study tools into ONE cohesive app**:
- You can join a virtual study club with a simple 6-character code.
- You can study together in simulated video study rooms with live status tags.
- You can chat with an AI tutor or turn raw lecture notes into 3D flashcards and quizzes in 10 seconds.
- You can run a Pomodoro timer with soothing rain or lo-fi audio in the top header.
- You can organize homework tasks on a visual Kanban board.
- Administrators can moderate users, clubs, and send platform-wide broadcast alerts.

---

## 🧩 3. The 7 Core Modules Explained

### Module 01: Dual-Role Authentication & Security
- **What it does:** Allows people to sign up either as a **Student** or as an **Administrator**.
- **Unique Username Security:** Every student and admin must register with a unique handle (e.g. `@superadmin`, `@alex_r`). A live checker verifies that no one else has taken that username.
- **Admin Passcode Protection:** Anyone registering as an administrator must enter authorization passcode `ADMIN2026`. This prevents regular students from escalating their own privileges.
- **Demo Quick-Login:** A 1-click button on the login screen automatically fills demo credentials so evaluators can test instantly.

### Module 02: Collaborative Study Clubs & Virtual Study Rooms
- **What it does:** Students can create study clubs (like *Quantum Physics Guild* or *AI & ML Lab*) or join existing clubs with a 6-character code (e.g. `QUANTUM42`).
- **Virtual Study Room:** A simulated video grid with webcam cards showing mute/unmute toggles and live focus status badges (*Studying*, *Lo-Fi Focus*, *Break*).
- **Club Group Chat:** A real-time message board for discussing homework questions.
- **Club Leaderboard:** Ranks members based on weekly study hours, completed Pomodoros, and quiz performance.

### Module 03: AI Study Companion (Gemini AI + Smart Fallback)
- **What it does:** A 24/7 intelligent study partner.
- **AI Tutor:** Ask questions in plain English and receive clear explanations, math formulas, and code snippets.
- **3D Flipping Flashcards:** Enter any topic (e.g. *Organic Chemistry*) to generate interactive cards that flip in 3D.
- **Quiz Master:** Generates 5 multiple-choice questions on any topic with instant grading, correct answer explanations, and score tracking.
- **Notes Summarizer:** Paste messy lecture notes to receive clean bullet points and key vocabulary.

### Module 04: Pomodoro Focus Timer & Ambient Soundscape
- **What it does:** Breaks studying into 25-minute focus intervals and 5-minute rejuvenating breaks.
- **Global Header Mini-Widget:** The timer remains visible and ticking in the top header bar across all pages.
- **Live Waveform Audio Visualizer:** Dynamic animated waveform pulse displayed in the header during active study sessions.
- **Ambient Soundtracks:** Switch between *Gentle Rain*, *Lo-Fi Beats*, and *Cozy Cafe Ambience* to block out noisy environments.
- **Automatic Logging:** Completed Pomodoro cycles automatically increment your total study hours and club leaderboard points.

### Module 05: Academic Planner, Kanban Board & Calendar
- **What it does:** Organizes school assignments and test dates visually.
- **3-Column Kanban Board:** Move tasks between *To Do*, *In Progress*, and *Completed* with priority tags (High, Medium, Low).
- **Study Calendar:** Schedule exams, workshops, and review sessions.
- **Markdown Notes Library:** A clean notebook for drafting and reading formatted study notes.

### Module 06: Gamification, Streaks & Badges
- **What it does:** Makes studying rewarding and fun.
- **Daily Streak Counter:** Shows consecutive active study days in the header with a flame badge.
- **Scholar Levels & XP:** Earn experience points by finishing tasks, completing Pomodoros, and taking quizzes.
- **Achievements Modal:** Unlock colorful badges like *Night Owl*, *Focus Master*, *Quiz Prodigy*, and *Club Pioneer*.

### Module 07: Administrator Operations & Moderation Console (`/admin`)
- **What it does:** An exclusive management dashboard for verified administrators.
- **User Moderation:** View all registered accounts, promote students to administrators, suspend rule-breakers, or delete accounts (with safeguards against self-deletion).
- **Study Clubs Moderation:** Inspect all clubs and member counts, with the power to disband inactive or spam clubs.
- **Broadcast Announcements:** Post emergency alerts or platform news banners that appear dynamically on every student's screen.
- **Security Audit Logs:** Chronological log tracking all registrations, credential creations, and role changes.
- **Platform Data Export:** Download a full JSON backup of users, clubs, tasks, and audit logs with one click.

---

## 🛠️ 4. Technical Architecture in Simple English

| Layer | Technology | Simple Explanation |
| :--- | :--- | :--- |
| **Frontend** | React 18 & Vite | Fast, responsive single-page application that updates without page reloads. |
| **Styling** | Custom CSS & Theme Tokens | Clean design system with 1-click Dark Mode and Light Mode switching. |
| **State Management** | React Context API | Passes auth, timer, and club data across components cleanly without extra libraries. |
| **Database** | Supabase + Local Storage | Hybrid database: connects to cloud PostgreSQL if keys exist; otherwise runs locally in the browser so anyone can test it with zero setup. |
| **Artificial Intelligence**| Google Gemini API + Offline Fallback | Connects to Gemini models; falls back to an intelligent local engine if offline. |
| **Security Guards** | ProtectedRoute & AdminRoute | Prevents unauthorized visitors from seeing private data and blocks non-admins from `/admin`. |

---

## 🔑 5. Pre-Configured Demo Accounts (Ready to Test)

| Account Type | Username | Email | Password | Admin Passcode | Permissions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Super Administrator** | `superadmin` | `admin@studyclub.edu` | `admin123` | `ADMIN2026` | Full access to `/admin`, user moderation, broadcasts, club deletion, audit logs. |
| **Standard Student** | `alex_r` | `alex@example.com` | `password123` | — | Access to clubs, virtual rooms, AI tutor, timer, planner, and badges. |

---

## 🚀 6. How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/shreya-s-f/StudyClub.git
cd StudyClub
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open in browser
Open [http://localhost:5173](http://localhost:5173) to start exploring!

---

## ❓ 7. Frequently Asked Questions (FAQ)

**Q: Where can I see this guide inside the web app?**  
A: Log in and click **"Project Guide"** in the sidebar navigation or top header bar (or visit `/guide`).

**Q: Can I test without creating a new account?**  
A: Yes! On the login page, switch to the **Admin Portal** tab and click **"⚡ One-Click: Fill Demo Admin Credentials"** to sign in immediately.

**Q: Why do admins need a unique username?**  
A: Every moderation action is recorded in the immutable security audit log. Unique usernames ensure total accountability.

**Q: Can I export data from the app?**  
A: Yes! From the Project Guide page (`/guide`) or Admin Console (`/admin`), you can download complete JSON or Markdown reports with a single click.

---

*Authored with care for StudyClub learners, evaluators, and educators.*
