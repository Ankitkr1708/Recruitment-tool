import React from 'react';
import CandidateForm from '../components/CandidateForm';

function AddCandidate() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Add New Candidate</h1>
        <CandidateForm />
      </div>
    </div>
  );
}

export default AddCandidate;