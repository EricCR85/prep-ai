export const difficultyQuestions = {
  Beginner: [
    "Tell me about your experience with React.",
    "What are HTML semantic tags and why do we use them?",
    "Explain the difference between let, const, and var in JavaScript.",
  ],
  Intermediate: [
    "Explain the difference between state and props.",
    "What is the Virtual DOM and how does it work?",
    "How does asynchronous code work in JavaScript using Promises or Async/Await?",
  ],
  Advanced: [
    "How do you optimize a React app that suffers from slow rendering issues?",
    "Explain closures in JavaScript and provide a practical real-world production use case.",
    "How would you handle global state management across an enterprise micro-frontend application?",
  ],
};

export const getAiFeedback = (question, transcript) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const performanceScore = Math.min(
        98,
        Math.max(
          65,
          Math.floor(65 + (transcript?.length || 0) * 0.1 + Math.random() * 10),
        ),
      );

      const feedbackData = {
        score: performanceScore,
        generalFeedback: `Good job formulating your explanation for "${question.substring(0, 25)}...". Your answer demonstrated fundamental knowledge.`,
        strengths:
          "You spoke clearly and integrated vital industry terminology directly into your presentation framework.",
        improvements:
          "Consider adding specific production-level examples or edge-case handling scenarios to maximize depth.",
      };

      resolve(feedbackData);
    }, 2000);
  });
};
