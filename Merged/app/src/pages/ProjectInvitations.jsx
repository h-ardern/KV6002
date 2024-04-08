import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom'; // Assuming you are using react-router-dom for routing
import './ProjectsList.css';

//Author @Harry Wallis

const ProjectInvitations = () => {
  const { state: { userId } } = useAuthContext();
  const [projects, setProjects] = useState([]);
  const [invitations, setInvitations] = useState([]);

  // Get the projects from endpoint using userId for query

  useEffect(() => {
    if (!userId) return;
    const url = `https://w19013579.nuwebspace.co.uk/API/get-researcher-projects.php?researcherId=${userId}`;
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

  const handleProjectClick = (projectId) => {
    // Fetch project invitations
    const url = `https://w19013579.nuwebspace.co.uk/API/get-researcher-projects-applicants.php?projectId=${projectId}`;
    fetch(url)
      .then(response => response.json())
      .then(data => setInvitations(data))
      .catch(error => console.error('Error:', error));
  };

   //Check to make sure user is a researcher not applicant before rendering rest of file

  if (!userId) {
    return (
      <div className="projects-list">
        <p>You are not logged in. Please log in or sign up to access this page.</p>
      </div>
    );
  }
  
  //Render table for the research projects
  return (
    <div>
      <h2>My Research Projects</h2>
      <table>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Interested</th>
            <th>Accepted</th>
            <th>Declined</th>
            <th>Pending</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map((project) => (
              <tr key={project.id}>
                <td>
                    <button className="project-name-btn" onClick={() => handleProjectClick(project.id)}>
                         {project.name}
                    </button>
                </td>
                <td>{project.description}</td>
                <td>{project.Status}</td>
                <td>{project.interested}</td>
                <td>{project.accepted}</td>
                <td>{project.declined}</td>
                <td>{project.pending}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No projects found.</td>
            </tr>
          )}
        </tbody>
      </table>
    {invitations.length > 0 && (
        <div>
          <h2>Project Invitations</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((invite) => (
                <tr key={invite.id}>
                  <td>{invite.participantName}</td>
                  <td>{invite.decision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectInvitations;
