// src/pages/PipelinesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPipelines, deletePipeline } from '../api/pipelines'; // API functions

function PipelinesPage() {
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPipelines = async () => {
    try {
      setLoading(true);
      const data = await getAllPipelines();
      setPipelines(data);
    } catch (err) {
      console.error('Error fetching pipelines:', err);
      setError('Failed to load pipelines. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelines();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pipeline? This might affect existing jobs!')) {
      try {
        await deletePipeline(id);
        alert('Pipeline deleted successfully!');
        fetchPipelines(); // Refresh the list
      } catch (err) {
        console.error('Error deleting pipeline:', err);
        setError('Failed to delete pipeline.');
      }
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading pipelines...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Pipelines List</h2>
      <Link to="/pipelines/new" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px', display: 'inline-block', marginBottom: '20px' }}>
        Create New Pipeline
      </Link>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Pipeline Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Number of Steps</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pipelines.map((pipeline) => (
            <tr key={pipeline._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <Link to={`/pipelines/${pipeline._id}`}>{pipeline.pipeline_name}</Link>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{pipeline.steps ? pipeline.steps.length : 0}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button onClick={() => handleDelete(pipeline._id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pipelines.length === 0 && <p>No pipelines found.</p>}
    </div>
  );
}

export default PipelinesPage;