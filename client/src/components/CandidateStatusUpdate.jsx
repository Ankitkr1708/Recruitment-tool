import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';
const STATUS_OPTIONS = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

// Accept onStatusUpdate prop to notify the parent component
function CandidateStatusUpdate({ candidateId, currentStatus, onStatusUpdate }) {
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState('');

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setMessage('Updating...');

    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      const updatedCandidate = await response.json();
      
      // --- NEW: Call the callback prop ---
      if (onStatusUpdate) {
        onStatusUpdate(updatedCandidate);
      }
      
      setStatus(updatedCandidate.status);
      setMessage('Status updated successfully!');
      
      setTimeout(() => setMessage(''), 3000);

    } catch (err) {
      setMessage(`Error: ${err.message}`);
      setStatus(currentStatus); // Revert on failure
    }
  };

  return (
    // ... (JSX remains the same) ...
    <div className="mt-4">
      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
        Update Candidate Status
      </label>
      <div className="flex items-center space-x-2">
        <select
          id="status"
          name="status"
          value={status}
          onChange={handleStatusChange}
          className="mt-1 block w-full max-w-xs pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {message && <span className="text-sm text-gray-600">{message}</span>}
      </div>
    </div>
  );
}

export default CandidateStatusUpdate;