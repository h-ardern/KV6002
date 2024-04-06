import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

/**
 * @author Joshua Marfleet
 *
 */


const UploadStudy = () => {
  const navigate = useNavigate();
  const { state: { signedIn, userType, userId } } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    objectives: '',
    methodology: '',
    participantRequirements: '',
    institution: '',
    researcherName: '',
    researchArea: '',
    compensation: '',
    startDate: '',
    endDate: '',
    applicationDeadline: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState('');

  if (!signedIn) {
    return <div style={{ marginTop: '60px', textAlign: 'center' }}>Please sign in to view this page.</div>;
  }

  if (signedIn && userType !== 'researcher') {
    return <div style={{ marginTop: '60px', textAlign: 'center' }}>Your account type does not allow for you to view this page.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('Submitting...');

    const submissionData = { ...formData, userId };

    try {
      const response = await fetch('https://w20013299.nuwebspace.co.uk/kv6002/API/StudyUpload', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const resultText = await response.text();
      console.log(resultText);
      setSubmissionStatus('Study submitted successfully!');
      setTimeout(() => navigate('/'), 2000); 
    } catch (error) {
      console.error('Error:', error);
      setSubmissionStatus('Failed to submit study. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px', padding: '20px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Link to="/uploadedstudies" style={{ color: '#007bff', textDecoration: 'underline' }}>
          View My Uploaded Studies
        </Link>
      </div>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center' }}>Upload New Study</h2>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              {key[0].toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
            </label>
            <input
              type={key.includes('Date') || key === 'applicationDeadline' ? 'date' : 'text'}
              name={key}
              value={value}
              onChange={handleChange}
              required
              placeholder={
                key === 'name' ? "Enter the study's name" :
                key === 'description' ? "Provide a brief overview of the study" :
                key === 'objectives' ? "List the study's primary objectives" :
                key === 'methodology' ? "Describe the methodology used for the study" :
                key === 'participantRequirements' ? "Specify any requirements for participants, e.g., age, health conditions" :
                key === 'institution' ? "Name of the institution conducting the study" :
                key === 'researcherName' ? "The lead researcher's name" :
                key === 'researchArea' ? "The primary area of research, e.g., Psychology, Nutrition" :
                key === 'compensation' ? "Describe the compensation, e.g., none, gift cards, travel expenses" :
                key.includes('Date') ? `Enter the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}` :
                ""
              }
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
        ))}
        <button type="submit" style={{ display: 'block', width: '100%', padding: '10px', background: '#007bff', color: '#ffffff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Submit
        </button>
        {submissionStatus && <div style={{ marginTop: '20px', textAlign: 'center' }}>{submissionStatus}</div>}
      </form>
    </div>
  );
};

export default UploadStudy;
