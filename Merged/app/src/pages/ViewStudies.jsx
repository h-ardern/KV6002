import React, { useState, useEffect } from 'react';

/**
 * @author Joshua Marfleet
 *
 */

const ViewStudies = () => {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://w20012045.nuwebspace.co.uk/kv6002/merged/api/getstudies')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setStudies(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setError('Failed to fetch studies.');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>View Studies</h2>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        alignItems: 'start',
      }}>
        {studies.map(study => (
          <div key={study.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#fafafa',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <h3 style={{ color: '#0056b3', marginBottom: '15px' }}>{study.name}</h3>
              <p style={{ marginBottom: '10px' }}><strong>Description:</strong> {study.description}</p>
              <p style={{ marginBottom: '10px' }}><strong>Objectives:</strong> {study.objectives}</p>
              <p style={{ marginBottom: '10px' }}><strong>Methodology:</strong> {study.methodology}</p>
              <p style={{ marginBottom: '10px' }}><strong>Participant Requirements:</strong> {study.participantRequirements}</p>
              <p style={{ marginBottom: '10px' }}><strong>Institution:</strong> {study.institution}</p>
              <p style={{ marginBottom: '10px' }}><strong>Researcher Name:</strong> {study.researcherName}</p>
              <p style={{ marginBottom: '10px' }}><strong>Research Area:</strong> {study.researchArea}</p>
              <p style={{ marginBottom: '10px' }}><strong>Compensation:</strong> {study.compensation}</p>
              <p style={{ marginBottom: '10px' }}><strong>Start Date:</strong> {study.startDate}</p>
              <p style={{ marginBottom: '10px' }}><strong>End Date:</strong> {study.endDate}</p>
              <p><strong>Application Deadline:</strong> {study.applicationDeadline}</p>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewStudies;
