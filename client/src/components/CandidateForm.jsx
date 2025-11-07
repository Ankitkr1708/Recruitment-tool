import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

function CandidateForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jobTitle: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1) If a resume file is selected, upload it first and get back a resumeUrl
      let resumeLink = undefined;
      if (resumeFile) {
        const uploadForm = new FormData();
        uploadForm.append('resume', resumeFile);

        const uploadResp = await fetch(`${API_BASE_URL}/candidates/upload-resume`, {
          method: 'POST',
          body: uploadForm,
        });

        if (!uploadResp.ok) {
          const err = await uploadResp.json().catch(() => ({}));
          throw new Error(err.message || 'Resume upload failed');
        }

        const uploadData = await uploadResp.json();
        resumeLink = uploadData.resumeUrl;
      }

      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, resumeLink }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to create candidate');
      }

      // On success, navigate back to the candidate list
      navigate('/candidates');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
          Job Title
        </label>
        <input
          type="text"
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
          Resume (PDF or DOCX)
        </label>
        <input
          type="file"
          id="resume"
          name="resume"
          accept=".pdf, .doc, .docx"
          onChange={handleFileChange}
          className="mt-1 block w-full"
        />
        {resumeFile && (
          <p className="text-sm text-gray-500 mt-1">Selected file: {resumeFile.name}</p>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Candidate'}
        </button>
      </div>
    </form>
  );
}

export default CandidateForm;