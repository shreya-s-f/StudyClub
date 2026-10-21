// ==============================================================================
// StudyClub — Complete Project Knowledge Base & Guide
// Written in simple, friendly English so everyone can understand it!
// ==============================================================================

export const PROJECT_METADATA = {
  name: 'StudyClub',
  tagline: 'Collaborative Learning & Productivity Platform for Students',
  version: '2.0.0',
  summary: 'StudyClub is an all-in-one web platform where students can study together in virtual rooms, stay focused with a Pomodoro timer, get instant homework help from AI, and keep their academic tasks neatly organized.',
  targetAudience: 'College students, school students, self-learners, study groups, and academic communities.',
  coreMission: 'Eliminate study distractions by uniting virtual study rooms, AI tutoring, task planning, and community leaderboards in a single easy-to-use web application.'
}

export const PROBLEM_STATEMENT = {
  title: 'Why was StudyClub built?',
  subtitle: 'The Problem Students Face Every Single Day',
  description: 'Most students use 5 or 6 different apps just to get their schoolwork done. They use Discord or Zoom for group calls, Notion or Google Docs for notes, ChatGPT for explanations, Quizlet for flashcards, and Todoist for deadlines. Switching constantly between all these tabs breaks concentration and causes cognitive overload.',
  solution: 'StudyClub fixes this by combining every essential study tool into ONE cohesive browser workspace. You can join a virtual study club, chat with classmates, start a focus timer, turn lecture notes into quizzes with AI, and track tasks—without ever leaving the app!'
}

export const PROJECT_STATS = [
  { label: 'Core Modules', value: '7 Systems', description: 'Auth, Clubs, AI, Timer, Planner, Badges, Admin' },
  { label: 'Target Users', value: 'Students & Admins', description: 'Dual-role access with dedicated consoles' },
  { label: 'Built With', value: 'React & Vite', description: 'Ultra-fast, responsive single page application' },
  { label: 'Data Engine', value: 'Hybrid Storage', description: 'Supabase PostgreSQL + Local Storage fallback' }
]

export const MODULES_BREAKDOWN = [
  {
    id: 'auth',
    number: '01',
    name: 'Dual-Role Authentication & Profile Security',
    icon: 'ShieldCheck',
    badge: 'Security & Access',
    shortSummary: 'Secure sign-up and sign-in for Students and Platform Administrators with unique username validation.',
    whatItDoes: 'Allows users to register either as a regular student or as a platform administrator. Admin sign-ups require a unique handle (e.g., @superadmin) and a security authorization passcode.',
    whyItMatters: 'Keeps regular student accounts separate from privileged administrator accounts, ensuring only verified people can moderate clubs and manage users.',
    features: [
      'Dual Portal Switcher: Easily toggle between Student Portal and Admin Portal on the login page.',
      'Unique Username Verification: Real-time availability check that prevents duplicate usernames across the platform.',
      'Administrator Passcode Gate: Registering as an admin requires passcode "ADMIN2026" to prevent unauthorized escalation.',
      'Password Strength & Confirm Matching: Enforces 6+ character passwords with password visibility eye toggles.',
      'Instant Demo Login: 1-Click button on the sign-in form to automatically fill sample admin or student credentials.'
    ],
    tryItLink: '/login',
    tryItLabel: 'Try Sign In / Sign Up'
  },
  {
    id: 'clubs',
    number: '02',
    name: 'Collaborative Study Clubs & Virtual Study Rooms',
    icon: 'Users',
    badge: 'Collaboration',
    shortSummary: 'Virtual study spaces where classmates study together, chat, share notes, and hold each other accountable.',
    whatItDoes: 'Students can create study clubs for their courses (like Quantum Physics or Dev Hub) or join clubs using a 6-character code. Inside, they can enter a virtual room with live participant video cards.',
    whyItMatters: 'Studying alone can be boring and demotivating. Seeing your friends studying with live status tags creates a powerful feeling of focus and accountability (virtual body doubling).',
    features: [
      'Simple Club Creation: Enter a name and description to instantly generate a 6-character join code.',
      'Virtual Study Room Grid: Simulated webcam video cards with mute/unmute, camera toggles, and live focus tags ("Studying", "Lo-Fi Focus", "Break").',
      'Real-Time Club Chat: Group message board where club members ask questions and share study tips.',
      'Club Leaderboard: Ranks members based on weekly study hours, completed Pomodoros, and quiz scores.'
    ],
    tryItLink: '/clubs',
    tryItLabel: 'Explore Study Clubs'
  },
  {
    id: 'ai',
    number: '03',
    name: 'AI Study Companion (Tutor, Flashcards & Quizzes)',
    icon: 'Sparkles',
    badge: 'AI Powered',
    shortSummary: 'Your 24/7 personal tutor that turns complex topics into simple explanations, flashcards, and quizzes.',
    whatItDoes: 'Connects to Google Gemini AI (with a built-in local offline fallback) to explain tough concepts, generate 3D interactive flashcard decks, create practice quizzes, and summarize lecture notes.',
    whyItMatters: 'Students often get stuck late at night when teachers and tutors are unavailable. The AI Study Companion gives instant, patient, step-by-step assistance in plain English.',
    features: [
      'Interactive AI Tutor: Chat in natural English to get clear answers, math formulas formatted with KaTeX, and code samples.',
      '3D Flipping Flashcards: Enter any subject to instantly create a study deck. Click cards to flip them in 3D and rate your confidence.',
      'Interactive Quiz Master: Generates 5 multiple choice questions on any topic with instant grading, correct answer feedback, and score tracking.',
      'Smart Notes Summarizer: Paste messy lecture notes or textbook passages to get a clean bulleted summary with key definitions.'
    ],
    tryItLink: '/ai',
    tryItLabel: 'Open AI Assistant'
  },
  {
    id: 'pomodoro',
    number: '04',
    name: 'Pomodoro Focus Timer & Ambient Soundscape',
    icon: 'Clock',
    badge: 'Productivity',
    shortSummary: 'Science-backed interval timer that runs globally across pages with soothing background audio.',
    whatItDoes: 'Breaks your study time into 25-minute focus sessions followed by 5-minute rejuvenating breaks. The timer stays visible in the top header no matter what page you navigate to.',
    whyItMatters: 'The Pomodoro Technique prevents burnout and procrastination by making study sessions manageable and rewarding.',
    features: [
      'Global Mini-Widget: A sleek countdown widget in the top header that never resets when switching pages.',
      'Live Waveform Visualizer: Animated audio pulse indicator in the header whenever the timer is active.',
      'Ambient Soundtracks: Choose between Gentle Rain, Lo-Fi Study Beats, or Cozy Cafe ambience to block out noise.',
      'Automatic Session Logging: Completed Pomodoros automatically increment your study hours and club leaderboard standing.'
    ],
    tryItLink: '/dashboard',
    tryItLabel: 'Try Focus Timer'
  },
  {
    id: 'planner',
    number: '05',
    name: 'Academic Planner, Kanban Board & Calendar',
    icon: 'CalendarCheck',
    badge: 'Organization',
    shortSummary: 'Visual organization system for school assignments, exam dates, deadlines, and markdown notes.',
    whatItDoes: 'Gives you a drag-and-drop style Kanban board for your tasks, a colorful study calendar for deadlines, and a searchable notebook for digital notes.',
    whyItMatters: 'Missing homework deadlines causes huge stress. Having your to-do list and calendar right next to your study tools guarantees you stay ahead of your schedule.',
    features: [
      '3-Column Kanban Board: Organize tasks into To Do, In Progress, and Completed with high/medium/low priority tags.',
      'Interactive Study Calendar: Schedule upcoming midterm exams, workshops, and review sessions with color codes.',
      'Markdown Notes Hub: Save formatted study notes with headings, bold text, code blocks, and topic tags.',
      'One-Click Quick Task: Add new tasks in 2 seconds directly from your dashboard or planner.'
    ],
    tryItLink: '/planner',
    tryItLabel: 'Open Planner'
  },
  {
    id: 'gamification',
    number: '06',
    name: 'Achievements, Badges & Streaks Gamification',
    icon: 'Trophy',
    badge: 'Motivation',
    shortSummary: 'Gamified rewards system that turns daily learning into an exciting game with badges and levels.',
    whatItDoes: 'Tracks your daily study streaks, awards XP points for completing Pomodoros and quizzes, and unlocks colorful badges as you achieve milestones.',
    whyItMatters: 'Habit building requires positive reinforcement. Seeing your streak counter grow every day makes studying as addictive as a mobile game.',
    features: [
      'Daily Study Streak Counter: Displays your consecutive active days with a flaming streak icon in the top header.',
      'Scholar Level & XP Progression: Gain experience points with every finished task and focus session to level up.',
      'Interactive Badges Modal: View earned and locked badges like "Night Owl", "Focus Master", "Quiz Prodigy", and "Club Pioneer".',
      'Community Status: Your level and streak are visible to your club friends to encourage friendly competition.'
    ],
    tryItLink: '/dashboard',
    tryItLabel: 'View Achievements'
  },
  {
    id: 'admin',
    number: '07',
    name: 'Administrator Operations & Moderation Console',
    icon: 'ShieldAlert',
    badge: 'Admin Only',
    shortSummary: 'Command center for administrators to moderate users, clubs, broadcast alerts, and review audit logs.',
    whatItDoes: 'A restricted control room accessible only to users with the admin role. Admins can view all registered accounts, promote/suspend users, moderate study clubs, send platform-wide banner announcements, and view security audit trails.',
    whyItMatters: 'Online student communities need safety, moderation, and communication channels. This console gives school administrators or club managers complete oversight.',
    features: [
      'User Management Table: Search and filter all users. Promote students to admins, suspend rule-breakers, or delete accounts.',
      'Study Club Moderation: Review all study clubs, join codes, and member counts, with the power to disband inactive or spam clubs.',
      'Platform Broadcast System: Post alert or info banners that instantly display across all student screens.',
      'Security Audit Log: Chronological log tracking every sign-up, role change, and deletion with admin identity stamps.',
      'Platform Data Export: Download a comprehensive JSON backup of all users, clubs, tasks, and system logs with one click.'
    ],
    tryItLink: '/admin',
    tryItLabel: 'Open Admin Console'
  }
]

export const TECH_STACK_EXPLAINED = [
  {
    title: 'Frontend (What you see and click)',
    tech: 'React 18 & Vite',
    simpleExplanation: 'React allows the app to update instantly without refreshing the browser page. Vite makes the application load in milliseconds.'
  },
  {
    title: 'Styling & Design Tokens',
    tech: 'Custom CSS Tokens & Dark Mode',
    simpleExplanation: 'Hand-crafted CSS with custom color variables, smooth transitions, and seamless 1-click Dark/Light mode switching.'
  },
  {
    title: 'State & Data Flow',
    tech: 'React Context API',
    simpleExplanation: 'Handles global state (who is logged in, timer seconds, active club) so information flows effortlessly between components without complex external tools.'
  },
  {
    title: 'Database & Storage',
    tech: 'Supabase PostgreSQL + Local Storage',
    simpleExplanation: 'A smart hybrid engine: if Supabase credentials are provided, data connects to cloud PostgreSQL. If not, it runs locally in your browser so you can test immediately with zero setup!'
  },
  {
    title: 'Artificial Intelligence',
    tech: 'Google Gemini API + Smart Fallback',
    simpleExplanation: 'Uses Google Gemini models to generate flashcards and quizzes. If offline or no API key is set, a smart local engine answers immediately.'
  },
  {
    title: 'Route Security',
    tech: 'ProtectedRoute & AdminRoute Guards',
    simpleExplanation: 'Stops unauthorized guests from viewing private study data, and stops regular students from accessing the administrator dashboard.'
  }
]

export const USER_GUIDES = [
  {
    role: 'New Student',
    steps: [
      'Click "Sign Up" on the login page and enter your name, email, password, and major.',
      'Visit the "Study Clubs" page and join a club using code "QUANTUM42" or create your own club.',
      'Click "Launch Focus Timer" in the header to start your first 25-minute Pomodoro study sprint.',
      'Jump over to "AI Assistant" and type any topic to generate a 3D flashcard deck or quiz.',
      'Organize your upcoming homework in the "Planner & Tasks" Kanban board.'
    ]
  },
  {
    role: 'Administrator / Evaluator',
    steps: [
      'Click "Admin Portal" on the login screen, or click the "⚡ Fill Demo Admin Credentials" button.',
      'Alternatively, register a new Admin by providing a unique username (e.g. @admin_demo) and passcode "ADMIN2026".',
      'You will be redirected straight to the Admin Operations Console at "/admin".',
      'Explore the "User Management" tab to promote, demote, or suspend accounts.',
      'Post a broadcast announcement on the "Broadcasts" tab to see the live alert banner appear in the header.'
    ]
  }
]

export const DEMO_CREDENTIALS = [
  {
    role: 'Super Administrator',
    username: 'superadmin',
    email: 'admin@studyclub.edu',
    password: 'admin123',
    passcode: 'ADMIN2026',
    privileges: 'Full access to Admin Console, user moderation, club deletion, announcements, and audit logs.'
  },
  {
    role: 'Standard Student',
    username: 'alex_r',
    email: 'alex@example.com',
    password: 'password123',
    passcode: 'None (Student)',
    privileges: 'Access to virtual study rooms, clubs, AI tutor, Pomodoro timer, planner, and achievements.'
  }
]

export const FAQS = [
  {
    question: 'What is StudyClub in one simple sentence?',
    answer: 'StudyClub is an all-in-one web app where students study together in virtual rooms, stay focused with a Pomodoro timer, get instant AI homework help, and track their assignments.'
  },
  {
    question: 'How do I test the application quickly without registering?',
    answer: 'On the Sign In page, click the "⚡ One-Click: Fill Demo Admin Credentials" button under the Admin Portal tab. It fills the credentials instantly so you can log in with one click!'
  },
  {
    question: 'Why does an Administrator need a unique username?',
    answer: 'Administrators have special permissions to moderate clubs and manage user accounts. A unique username (like @superadmin) ensures every action in the security audit log is clearly attributed to a specific person.'
  },
  {
    question: 'What is the Admin Passcode?',
    answer: 'The default authorization passcode is "ADMIN2026". Anyone signing up for an Administrator account must provide this passcode to prevent unauthorized users from granting themselves admin powers.'
  },
  {
    question: 'Does StudyClub work without internet or without a Supabase cloud database?',
    answer: 'Yes! StudyClub uses a smart hybrid storage engine. If Supabase cloud is not configured, it runs seamlessly in your web browser using persistent local storage with realistic mock data.'
  },
  {
    question: 'What happens if I try to visit "/admin" as a regular student?',
    answer: 'The application uses strict route security (AdminRoute). Regular students are automatically blocked from entering, and redirected back to their dashboard with an access-denied notification.'
  },
  {
    question: 'Can an administrator delete their own account?',
    answer: 'No. The platform enforces a security rule preventing an administrator from accidentally deleting or demoting their own currently active session.'
  },
  {
    question: 'How does the AI Study Companion work?',
    answer: 'It connects to Google Gemini AI to analyze questions and generate learning materials. If no API key is configured, an intelligent built-in fallback engine responds with comprehensive study guides so the app always works.'
  }
]
