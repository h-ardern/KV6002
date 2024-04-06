import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * @author Joshua Marfleet
 *
 */

const UploadedStudies = () => {
  const { state: { userId, username, userType } } = useAuthContext();
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || userType !== 'researcher') {
      navigate('/login');
      return;
    }

    const fetchStudies = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://w20013299.nuwebspace.co.uk/kv6002/API/GetStudiesByClient?userId=${userId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setStudies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudies();
  }, [userId, userType, navigate]);

  const handleDelete = async (studyId) => {
    if (!window.confirm('Are you sure you want to delete this study?')) {
      return;
    }

    try {
      const response = await fetch('https://w20013299.nuwebspace.co.uk/kv6002/API/DeleteStudy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studyId, userId }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || 'Failed to delete the study');
      }

      setStudies(studies.filter(study => study.id !== studyId));
      alert('Study deleted successfully');
    } catch (err) {
      alert(err.message || 'Error deleting study');
    }
  };

  if (!userId) return <div>Please log in to view your uploaded studies.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>{username}, here are the studies that you currently have uploaded:</h2>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {studies.length === 0 && !loading && <div>You have not uploaded any studies yet.</div>}
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {studies.map((study) => (
          <li key={study.id} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ color: '#007bff' }}>{study.name}</h3>
            <p><strong>Description:</strong> {study.description}</p>
            <p><strong>Objectives:</strong> {study.objectives}</p>
            <p><strong>Methodology:</strong> {study.methodology}</p>
            <p><strong>Participant Requirements:</strong> {study.participantRequirements}</p>
            <p><strong>Institution:</strong> {study.institution}</p>
            <p><strong>Researcher Name:</strong> {study.researcherName}</p>
            <p><strong>Research Area:</strong> {study.researchArea}</p>
            <p><strong>Compensation:</strong> {study.compensation}</p>
            <p><strong>Start Date:</strong> {study.startDate}</p>
            <p><strong>End Date:</strong> {study.endDate}</p>
            <p><strong>Application Deadline:</strong> {study.applicationDeadline}</p>
            <button onClick={() => handleDelete(study.id)} style={{ margin: '10px 0', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadedStudies;
