# 🚀 PrepAI: Intelligent Mock Interviewer

PrepAI is a sleek, React-based mock interview platform designed to help developers practice technical communication under pressure. By leveraging the Web Speech API and intelligent feedback loops, PrepAI provides an immediate, real-time simulated environment for refining interview responses.

## 🛠 Tech Stack
* **Frontend:** React, Tailwind CSS
* **Speech Processing:** `react-speech-recognition`
* **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`)
* **Deployment:** Vercel

## 🔑 Key Features
* **Real-time Speech Analysis:** Captures and transcribes responses instantly using the Web Speech API.
* **Visual Feedback Loop:** Integrated pulsing UI indicators that provide clear feedback when the microphone is active.
* **Performance Dashboard:** Tracks progress across multiple sessions, allowing users to review AI-generated feedback and identify areas for improvement.
* **Resilient Design:** Implemented robust error handling, including toast notifications and automatic state persistence via `localStorage`.

## ⚙️ How to Run Locally

1. **Clone the repository:**
```bash
git clone [https://github.com/EricCR85/prep-ai.git](https://github.com/EricCR85/prep-ai.git)
cd prep-ai
```
2. **Install dependencies:**
```bash
npm install
```
3. **Start the development server:**
```bash
npm run dev
```

## 💡 Engineering Highlights
* **Performance Optimization:** Resolved cascading rendering issues by utilizing lazy initialization for state and optimizing dependency arrays.
* **UI/UX Refinement:** Designed a production-ready interface with custom loading states, empty state management, and responsive CSS animations.
* **Code Quality:** Strictly maintained a lint-free codebase by effectively managing React hooks and side effects.

---
*Built with passion for better interview preparation.*
