import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CandidateStatusUpdate from '../components/CandidateStatusUpdate';

const API_BASE_URL = 'http://localhost:5000/api';

function CandidateDetail() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(''); // For scheduling

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/candidates/${id}`);
        if (!response.ok) {
          throw new Error('Candidate not found');
        }
        const data = await response.json();
        setCandidate(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  // Handler for the schedule button
  const handleScheduleInterview = async (interviewType) => {
    setNotification('Scheduling interview...');
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${id}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interviewType }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to schedule');
      }
      
      const updatedCandidate = await response.json();
      setCandidate(updatedCandidate); // Update local state
      setNotification(`Interview scheduled! Status set to: ${updatedCandidate.status}`);

    } catch (err) {
      setNotification(`Error: ${err.message}`);
    } finally {
      setTimeout(() => setNotification(''), 4000);
    }
  };

  if (loading) return <div className="text-center p-4">Loading candidate details...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  if (!candidate) return null;

  return (
    <>
      <Link to="/candidates" className="text-indigo-600 hover:text-indigo-900 mb-4 inline-block">
        &larr; Back to Candidate List
      </Link>
      
      <div className="bg-white shadow rounded-lg p-6">
        {/* Header Info */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-semibold text-gray-900">{candidate.name}</h1>
          <p className="mt-1 text-lg text-gray-600">{candidate.jobTitle}</p>
          <p className="mt-1 text-sm text-gray-500">{candidate.email}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1 text-xl font-semibold text-gray-900">{candidate.status}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">AI Score</h3>
            <p className="mt-1 text-xl font-semibold text-gray-900">{candidate.score}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Applied</h3>
            <p className="mt-1 text-xl font-semibold text-gray-900">{new Date(candidate.appliedDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Actions Section */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900">Actions</h2>
          
          {/* 1. Status Update Dropdown */}
          <CandidateStatusUpdate 
            candidateId={candidate._id}
            currentStatus={candidate.status}
            onStatusUpdate={(updatedData) => setCandidate(updatedData)} // Update state on change
          />
          
          {/* 2. Scheduling Actions */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">Schedule Interview</h3>
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={() => handleScheduleInterview('Technical')}
                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Schedule Technical
              </button>
              <button
                onClick={() => handleScheduleInterview('HR')}
                className="py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Schedule HR
              </button>
            </div>
            {notification && (
              <p className="mt-2 text-sm text-gray-600">{notification}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CandidateDetail;