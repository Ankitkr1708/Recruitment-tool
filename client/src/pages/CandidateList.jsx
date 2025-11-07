import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Define the API base URL. In a real app, this would be in a .env file.
const API_BASE_URL = 'http://localhost:5000/api';

function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch candidates from the API
 useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/candidates`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // --- MODIFICATION: Sort by score descendingly ---
        const sortedData = data.sort((a, b) => b.score - a.score);
        
        setCandidates(sortedData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []); // Empty dependency array means this runs once on mount

  // Client-side filtering logic
  const filteredCandidates = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(lowerCaseSearch) ||
      candidate.jobTitle.toLowerCase().includes(lowerCaseSearch)
    );
  }, [candidates, searchTerm]);

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center p-4">Loading candidates...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Candidate Pipeline</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Filter by name or title..."
            className="form-input px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link
            to="/add-candidate"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap"
          >
            Add New Candidate
          </Link>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <tr key={candidate._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                    <div className="text-sm text-gray-500">{candidate.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{candidate.jobTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      candidate.status === 'Offer' ? 'bg-green-100 text-green-800' :
                      candidate.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{candidate.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(candidate.appliedDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/candidates/${candidate._id}`} className="text-indigo-600 hover:text-indigo-900">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No candidates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CandidateList;