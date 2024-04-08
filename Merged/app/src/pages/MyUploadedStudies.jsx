import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UploadedStudies = () => {
  const { state: { userId, username, userType } } = useAuthContext();
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [studyToDelete, setStudyToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || userType !== 'researcher') {
      navigate('/');
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

  const requestDeleteStudy = (id) => {
    setStudyToDelete(id);
    setDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!studyToDelete) return;

    try {
      const response = await fetch('https://w20013299.nuwebspace.co.uk/kv6002/API/DeleteStudy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studyId: studyToDelete, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete the study');
      }

      setStudies(studies.filter(study => study.id !== studyToDelete));
      setDeleteConfirm(false);
      setStudyToDelete(null);
    } catch (err) {
      setError('Error deleting study: ' + err.message);
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
            <button onClick={() => requestDeleteStudy(study.id)} style={{ margin: '10px 0', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {deleteConfirm && (
        <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'white', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
          <p>Are you sure you want to delete this study?</p>
          <button onClick={handleDelete} style={{ marginRight: '20px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
            Yes
          </button>
          <button onClick={() => setDeleteConfirm(false)} style={{ marginLeft: '20px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>
            No
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadedStudies;
