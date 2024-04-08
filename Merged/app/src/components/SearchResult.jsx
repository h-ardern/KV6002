/**
 * Search result component
 *
 * Displays search results from the database
 *
 * @author Odera Anakpe
 *
 */

import { useState } from "react";
import Dialog from "./Dialog";
import { useAuthContext } from "../contexts/AuthContext";

const SearchResult = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleResultClick = (project) => {
    setSelectedProject(project);
  };

  const handleClose = () => {
    setSelectedProject(null);
  };
  return (
    <div>
      {projects.map((project) => (
        <Result
          key={project.project_id}
          project={project}
          onClick={handleResultClick}
        />
      ))}
      <Dialog
        show={!!selectedProject}
        project={selectedProject || {}}
        onClose={handleClose}
      />
    </div>
  );
};

export default SearchResult;

const Result = ({ project, onClick }) => {
  return (
    <div
      onClick={() => onClick(project)}
      className="cursor-pointer p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 mb-4 border border-gray-200 hover:border-blue-500"
    >
      <h3 className="font-bold text-lg text-blue-600">
        {project.project_name}
      </h3>
      <p className="text-gray-600 mt-1">
        {project.project_desc.length > 150
          ? project.project_desc.substring(0, 150) + "..."
          : project.project_desc}
      </p>
    </div>
  );
};
