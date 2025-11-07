import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CandidateList from './pages/CandidateList';
import CandidateDetail from './pages/CandidateDetail';
import AddCandidate from './pages/AddCandidate'; // We need this page

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidates" element={<CandidateList />} />
          <Route path="/candidates/:id" element={<CandidateDetail />} />
          <Route path="/add-candidate" element={<AddCandidate />} />
          {/* Add more routes here as needed */}
        </Routes>
      </main>
    </div>
  );
}

export default App;