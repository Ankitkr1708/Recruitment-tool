import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = 'http://localhost:5000/api';

// A reusable card component for metrics
function MetricCard({ title, value, description }) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
      {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
    </div>
  );
}

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/candidates/dashboard/summary`);
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setSummary(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  // Chart.js data configuration
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Candidates by Status',
      },
    },
  };

  const chartData = {
    labels: summary?.chartData?.labels || [],
    datasets: [
      {
        label: 'Candidate Count',
        data: summary?.chartData?.data || [],
        backgroundColor: 'rgba(79, 70, 229, 0.8)', // Indigo
      },
    ],
  };

  if (loading) return <div className="text-center p-4">Loading dashboard...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  if (!summary) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-900">Manager Dashboard</h1>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Candidates" 
          value={summary.totalCandidates} 
          description="All candidates in the pipeline"
        />
        <MetricCard 
          title="In Interview" 
          value={summary.interviewCandidates} 
          description="Candidates in 'Interview' status"
        />
        <MetricCard 
          title="Average AI Score" 
          value={summary.avgScore} 
          description="Average score from resume screening"
        />
        <MetricCard 
          title="Offers Extended" 
          value={summary.offerCandidates} 
          description="Candidates in 'Offer' status"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pipeline Overview</h2>
        <div style={{ position: 'relative', height: '40vh' }}>
          <Bar options={chartOptions} data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;