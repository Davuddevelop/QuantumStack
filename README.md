# 🌐 CampusSync — Intelligent Community Management

**CampusSync** is a premium, AI-powered platform designed for university clubs and developer communities. Built for hackathons and scalability, it leverages the power of OpenAI and Firebase to provide deep insights into community health, automate member networking, and streamline event planning.

---

## ✨ Core Features

### 🧠 AI-Driven Community Health
Get real-time analysis of your community's engagement levels. CampusSync analyzes member activity, attendance trends, and qualitative feedback to provide a "Health Score" and actionable recommendations to prevent churn.

### 🤝 Member Connect (AI Matchmaking)
Break the ice with intelligent member networking. Our AI engine analyzes interests, skills, and goals to suggest high-value connections between your members, fostering a more tight-knit community.

### 📅 Smart Event Planner
Describe your event goals in plain English, and our AI will generate a comprehensive event plan, including timelines, task lists, and marketing copy tailored to your community's voice.

### ☁️ Cloud-Synced Dashboard
A seamless, real-time experience powered by Firebase Firestore. Switch between multiple communities instantly with our standardized Club Switcher and see live updates across all modules.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore
- **AI Engine**: OpenAI GPT-4o
- **Frontend**: Vanilla HTML5, Modern CSS3 (Glassmorphism), Vanilla JavaScript
- **Security**: Firebase Admin SDK

---

## 📂 Project Structure

To ensure a clean and scalable codebase, QuantumStack is organized as follows:

| Directory | Description |
| :--- | :--- |
| [`backend/src`](file:///c:/Users/User/Jedi/QuantumStack/backend/src) | Core implementation (Express + TypeScript) |
| [`frontend/public`](file:///c:/Users/User/Jedi/QuantumStack/frontend/public) | Frontend assets and HTML templates |
| [`tests/`](file:///c:/Users/User/Jedi/QuantumStack/tests/) | Automated test suites |
| [`public/`](file:///c:/Users/User/Jedi/QuantumStack/public/) | Shared assets and static files |

---

## 📖 Documentation

For detailed information on the project's technical aspects, please refer to the following documents:

- 🏗️ **[Architecture](file:///c:/Users/User/Jedi/QuantumStack/ARCHITECTURE.md)**: Deep dive into the backend, integrations, and data flow.
- 🗺️ **[Roadmap](file:///c:/Users/User/Jedi/QuantumStack/ROADMAP.md)**: Product vision and upcoming features.
- 🚀 **[Deployment](file:///c:/Users/User/Jedi/QuantumStack/DEPLOYMENT.md)**: Instructions for deploying to Vercel and Firebase.
- 🔥 **[Firebase](file:///c:/Users/User/Jedi/QuantumStack/FIREBASE.md)**: Configuration, security rules, and data schema.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- A Firebase Project (Firestore enabled)
- An OpenAI API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Davuddevelop/QuantumStack.git
   cd QuantumStack
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key_here
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_PRIVATE_KEY="your_firebase_private_key"
   ```

4. **Fire up the engine**:
   ```bash
   npm start
   ```
   Visit `http://localhost:3000` to start sync'ing.

---

## 🎨 Design Philosophy

CampusSync features a **State-of-the-Art** design system focused on:
- **Glassmorphism**: Elegant, translucent layers that provide depth and modern feel.
- **Micro-animations**: Smooth transitions and hover effects that make the interface feel alive.
- **Accessibility**: Standardized ARIA roles and landmark structures for an inclusive experience.
- **Premium Aesthetics**: A curated "Ink & Accent" color palette designed to WOW at first glance.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ for the Hackathon.