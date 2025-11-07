/**
 * Simulates a time-intensive AI resume screening.
 * Now it "reads" the file path.
 * @param {string} resumeLink - The path to the resume, e.g., /uploads/resume-123.pdf
 * @returns {Promise<number>} A promise that resolves to a score between 60 and 99.
 */
const simulateAIScore = (resumeLink) => {
  return new Promise((resolve) => {
    console.log(`[AI Screener] Starting analysis for file: ${resumeLink}`);
    
    // In a real app, you would use fs.readFile() on the server path
    // and process the text.
    
    // Simulate a 2-second processing delay
    setTimeout(() => {
      const score = Math.floor(Math.random() * (99 - 60 + 1)) + 60;
      console.log(`[AI Screener] Analysis complete. Score: ${score}`);
      resolve(score);
    }, 2000);
  });
};

module.exports = { simulateAIScore };