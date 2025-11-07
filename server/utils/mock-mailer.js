/**
 * Simulates sending an interview invitation email.
 * @param {string} candidateEmail - The email address of the candidate.
 * @param {string} interviewType - E.g., 'Technical' or 'HR'.
 * @param {Date} timeSlot - The scheduled date and time.
 */
const sendInterviewEmail = (candidateEmail, interviewType, timeSlot) => {
  const formattedTime = timeSlot.toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  console.log('--- MOCK EMAIL SERVICE ---');
  console.log(`To: ${candidateEmail}`);
  console.log(`Subject: Invitation for ${interviewType} Interview`);
  console.log(
    `Dear Candidate,\n\nWe are pleased to invite you for a ${interviewType} interview.
     It has been scheduled for:\n\n${formattedTime}\n\nWe look forward to speaking with you.
     \n\nBest Regards,\nHR Team`
  );
  console.log('--- END MOCK EMAIL ---');
};

module.exports = { sendInterviewEmail };