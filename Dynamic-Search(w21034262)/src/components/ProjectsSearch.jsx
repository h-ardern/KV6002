import { useEffect, useState } from "react";
import SearchForm from "./SearchForm";
import SearchResult from "./SearchResult";

/**
 *
 * component used for searching research projects in the database
 *
 * @author Odera Anakpe
 */
const ProjectsSearch = ({ state }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [university, setUniversity] = useState("");
  const [interests, setInterests] = useState("");
  const [status, setStatus] = useState("All");
  const [projectData, setProjectData] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    fetch("https://w21034262.nuwebspace.co.uk/kv6002/api/search")
      .then((response) => {
        if (response.status === 200) return response.json();
      })
      .then((json) => {
        setProjectData(json);
      });
  }, []);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const lowercasedUniversity = university.toLowerCase();
    const results = projectData.filter((project) => {
      const matchesSearchTerm =
        project.project_name.toLowerCase().includes(lowercasedSearchTerm) ||
        project.project_desc.toLowerCase().includes(lowercasedSearchTerm);
      const matchesStatus =
        status === "All" ||
        project.status.toLowerCase() === status.toLowerCase();
      const matchesUniversity =
        !university ||
        project.institution_name.toLowerCase().includes(lowercasedUniversity);

      return matchesSearchTerm && matchesStatus && matchesUniversity;
    });
    setFilteredProjects(results);
  }, [searchTerm, status, university, projectData]);

  return (
    <>
      {state.signedIn && (
        <SearchForm
          state={state}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          university={university}
          setUniversity={setUniversity}
          interests={interests}
          setInterests={setInterests}
          status={status}
          setStatus={setStatus}
          showUniversity
        />
      )}
      {state.signedIn && <SearchResult projects={filteredProjects} />}
    </>
  );
};
export default ProjectsSearch;
