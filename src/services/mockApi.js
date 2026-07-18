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

      resolve({
        score,
        generalFeedback: `${selectedFeedback.generalFeedback} You addressed "${question.substring(0, 35)}...".`,
        strengths: selectedFeedback.strengths,
        improvements: selectedFeedback.improvements,
      });
    }, 1500);
  });
};
