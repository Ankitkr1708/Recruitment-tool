/**
 * Simulates a time-intensive AI resume screening.
 * @param {string} resumeLink - The URL of the resume (unused in mock).
 * @returns {Promise<number>} A promise that resolves to a score between 60 and 99.
 */
const simulateAIScore = (resumeLink) => {
  return new Promise((resolve) => {
    console.log(`[AI Screener] Starting analysis...`);
    
    // Simulate a 2-second processing delay
    setTimeout(() => {
      const score = Math.floor(Math.random() * (99 - 60 + 1)) + 60;
      console.log(`[AI Screener] Analysis complete. Score: ${score}`);
      resolve(score);
    }, 2000);
  });
};

module.exports = { simulateAIScore };