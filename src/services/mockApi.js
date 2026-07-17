

 
  /**
   * @param {string} question
   * @param {string} transcript
   * @returns {Promise<string>}
   */
  export const getAiFeedback = (question, transcript) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const feedback = `Good answer regarding ${question.substring(0, 15)}... Your input: "${transcript}"`;
      resolve(feedback);
    }, 2000);
  });
};
