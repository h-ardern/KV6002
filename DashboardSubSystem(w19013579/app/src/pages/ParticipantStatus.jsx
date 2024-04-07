import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom'; 
import './ProjectsList.css';

// Author @Harry Wallis

const ProjectsList = () => {
  const { state: { userId } } = useAuthContext();
  const [projects, setProjects] = useState([]);
  
  //Fetch for if user has been invited to any projects
  useEffect(() => {
    if (!userId) return;
    const url = `https://w19013579.nuwebspace.co.uk/API/get-offered-projects.php?userId=${userId}`;
    fetch(url)
      .then(response => {
        if (response.ok) {
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.includes('application/json')) {
            return response.json();
          }
          throw new TypeError('Received non-JSON response from server');
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then(data => {
        console.log(data); 
        setProjects(data); 
      })
      .catch(error => console.error('Error:', error));
  }, [userId]);
  
  // Makes sure user is logged in to see the page
  if (!userId) {
    return (
      <div className="projects-list">
        <p>You are not logged in. Please log in or sign up to access this page.</p>
      </div>
    );
  }
  
  // Function to accept or decline invites for research projects
  const updateDecision = (projectId, decision) => {
    const updateUrl = 'https://w19013579.nuwebspace.co.uk/API/update-project-decision.php';
    fetch(updateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectId, userId, decision }),
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          setProjects(projects.map(project => project.id === projectId ? { ...project, decision } : project));
        } else {
          throw new Error('Update unsuccessful');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to update the decision. Please try again.');
      });
  };
  
  // Populates page with table of projects user has been invited to with button to accept or decline each
  return (
    <div className="projects-list">
      <h2>Offered Research Projects</h2>
      <table>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>
                <div className="project-name">{project.name}</div>
                <p className="project-description">{project.description}</p> 
              </td>
              <td>{project.decision}</td>
              <td>
                {project.decision === 'pending' && (
                  <>
                    <button className="button-accept" onClick={() => updateDecision(project.id, 'accepted')}>✔️ Accept</button>
                    <button className="button-decline" onClick={() => updateDecision(project.id, 'declined')}>❌ Decline</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
};


export default ProjectsList;
