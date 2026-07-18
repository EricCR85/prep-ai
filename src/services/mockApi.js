// 1. CHOSEN JOB TRACK QUESTION ARRAYS
export const roleQuestions = {
  "Frontend Engineer": [
    "Explain the difference between the Virtual DOM and the real DOM in React.",
    "What are semantic HTML tags, and why are they important for accessibility and SEO?",
    "How do you handle performance optimization and state management in a massive React application?",
  ],
  "Backend Engineer": [
    "Explain how asynchronous programming works in JavaScript via the event loop.",
    "What is the difference between SQL and NoSQL databases, and when would you choose each?",
    "How do you secure RESTful API endpoints from malicious attacks or excessive requests?",
  ],
  "Full Stack Engineer": [
    "Describe the entire request-response lifecycle when a user types a URL into their browser.",
    "How do you handle authentication, sessions, and state synchronization across the client and server?",
    "What is your approach to structuring database schemas alongside highly dynamic UI components?",
  ],
};

const feedbackVariations = [
  {
    generalFeedback:
      "Excellent conceptual breakdown. You handled the core definitions well.",
    strengths: "Great use of technical terminology and clear structure.",
    improvements:
      "Try mentioning a specific framework feature or hooks to back up this concept.",
  },
  {
    generalFeedback:
      "Good response. You clearly understand the operational lifecycle here.",
    strengths:
      "Spoke confidently and got straight to the primary point of the question.",
    improvements:
      "Consider outlining edge cases or error handling scenarios next time.",
  },
  {
    generalFeedback:
      "Solid answer attempt. You addressed the primary engineering trade-offs nicely.",
    strengths: "Strong analytical breakdown and logical structure.",
    improvements:
      "Try providing a structural real-world architecture example to reinforce your explanations.",
  },
];

const getSimulatedDB = () => {
  const db = localStorage.getItem("prep_ai_cloud_db");
  return db ? JSON.parse(db) : { users: {}, activeSession: null };
};

const saveSimulatedDB = (data) => {
  localStorage.setItem("prep_ai_cloud_db", JSON.stringify(data));
};

export const registerUser = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const db = getSimulatedDB();

      if (!email || !password) {
        return reject(
          new Error("Email and password fields are strictly mandatory."),
        );
      }
      if (db.users[email.toLowerCase()]) {
        return reject(
          new Error("Registration failed: Account identifier already exists."),
        );
      }

      db.users[email.toLowerCase()] = {
        password: password,
        history: [],
      };

      saveSimulatedDB(db);
      resolve({
        success: true,
        message: "User document generated successfully.",
      });
    }, 1000);
  });
};

export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const db = getSimulatedDB();
      const user = db.users[email.toLowerCase()];

      if (!user || user.password !== password) {
        return reject(
          new Error("Invalid credentials: Passwords or accounts do not match."),
        );
      }

      db.activeSession = email.toLowerCase();
      saveSimulatedDB(db);

      localStorage.setItem("prep-ai-feedback", JSON.stringify(user.history));

      resolve({ success: true, email: db.activeSession });
    }, 1000);
  });
};

export const logoutUser = () => {
  const db = getSimulatedDB();
  db.activeSession = null;
  saveSimulatedDB(db);
  localStorage.removeItem("prep-ai-feedback");
  localStorage.removeItem("prep-ai-index");
  localStorage.removeItem("prep-ai-status");
};

export const getAiFeedback = (question, transcript) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const score = Math.min(
        98,
        Math.max(
          62,
          Math.floor(65 + (transcript?.length || 0) * 0.12 + Math.random() * 8),
        ),
      );

      const randomIndex = Math.floor(Math.random() * feedbackVariations.length);
      const selectedFeedback = feedbackVariations[randomIndex];

      const finalizedFeedbackObj = {
        score,
        generalFeedback: `${selectedFeedback.generalFeedback} You addressed "${question.substring(0, 35)}...".`,
        strengths: selectedFeedback.strengths,
        improvements: selectedFeedback.improvements,
      };

      const db = getSimulatedDB();
      if (db.activeSession && db.users[db.activeSession]) {
        db.users[db.activeSession].history.push({
          question,
          feedback: finalizedFeedbackObj,
        });
        saveSimulatedDB(db);
      }

      resolve(finalizedFeedbackObj);
    }, 1500);
  });
};

// export const roleQuestions = {
//   "Frontend Engineer": [
//     "Explain the difference between the Virtual DOM and the real DOM in React.",
//     "What are semantic HTML tags, and why are they important for accessibility and SEO?",
//     "How do you handle performance optimization and state management in a massive React application?",
//   ],
//   "Backend Engineer": [
//     "Explain how asynchronous programming works in JavaScript via the event loop.",
//     "What is the difference between SQL and NoSQL databases, and when would you choose each?",
//     "How do you secure RESTful API endpoints from malicious attacks or excessive requests?",
//   ],
//   "Full Stack Engineer": [
//     "Describe the entire request-response lifecycle when a user types a URL into their browser.",
//     "How do you handle authentication, sessions, and state synchronization across the client and server?",
//     "What is your approach to structuring database schemas alongside highly dynamic UI components?",
//   ],
// };

// const feedbackVariations = [
//   {
//     generalFeedback:
//       "Excellent conceptual breakdown. You handled the core definitions well.",
//     strengths: "Great use of technical terminology and clear structure.",
//     improvements:
//       "Try mentioning a specific framework feature or hooks to back up this concept.",
//   },
//   {
//     generalFeedback:
//       "Good response. You clearly understand the operational lifecycle here.",
//     strengths:
//       "Spoke confidently and got straight to the primary point of the question.",
//     improvements:
//       "Consider outlining edge cases or error handling scenarios next time.",
//   },
//   {
//     generalFeedback:
//       "Solid answer attempt. You addressed the primary engineering trade-offs nicely.",
//     strengths: "Strong analytical breakdown and logical structure.",
//     improvements:
//       "Try providing a structural real-world architecture example to reinforce your explanations.",
//   },
// ];

// export const getAiFeedback = (question, transcript) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const score = Math.min(
//         98,
//         Math.max(
//           62,
//           Math.floor(65 + (transcript?.length || 0) * 0.12 + Math.random() * 8),
//         ),
//       );

//       const randomIndex = Math.floor(Math.random() * feedbackVariations.length);
//       const selectedFeedback = feedbackVariations[randomIndex];

//       resolve({
//         score,
//         generalFeedback: `${selectedFeedback.generalFeedback} You addressed "${question.substring(0, 35)}...".`,
//         strengths: selectedFeedback.strengths,
//         improvements: selectedFeedback.improvements,
//       });
//     }, 1500);
//   });
// };
