# 🤖 Prep AI - Interactive Interview Terminal

An AI-powered interview simulation terminal designed to help developers practice mock technical interviews, use web speech recognition, and receive immediate structural AI performance feedback alongside targeted evaluation scores.

---

## 🚀 Live Demo

Check out the deployed application here: **[Prep AI Live on Vercel](https://prep-ai-git-main-eric-reeves-projects.vercel.app/)**

---

## ✨ Features Added (Mentor Review Updates)

* **Job Track Specialization:** Users can select targeted tracks (Frontend, Backend, or Full Stack Engineer) with specialized question pools ready.
* **Immediate Inline AI Feedback:** Provides dynamic performance scores, comprehensive summaries, key strengths, and target structural adjustments.
* **Session Progress Tracking:** Includes a real-time progress bar tracking the exact completion percentage of the interview sequence.
* **Global Light/Dark Mode:** Features a unified theme switcher that synchronizes both the content viewport and navigation panels seamlessly.
* **Persistence & Stateful Logs:** Utilizes browser `localStorage` to save answer matrices, cumulative grades, theme configurations, and session data.
* **Robust Exception Handling:** Gracefully handles unexpected stream timeouts, API network drops, and missing input exceptions with visual error toasts.

---

## 🛠 Tech Stack

* **Frontend Core:** React (Vite)
* **Routing & Navigation:** React Router DOM
* **Styling & Theme Utility:** Tailwind CSS
* **Audio Capture Engine:** React Speech Recognition (Web Speech API)
* **Icons:** Lucide React
* **Testing:** Vitest, jsdom, React Testing Library

---

## 📦 Installation & Local Setup

Follow these instructions to get a local copy up and running on your machine.

### Prerequisites

Make sure you have Node.js and npm installed on your computer.

* [Download Node.js](https://nodejs.org/)

### Setup Steps

1. **Clone the repository**
```bash
git clone [https://github.com/EricR85/prep-ai.git](https://github.com/EricR85/prep-ai.git)