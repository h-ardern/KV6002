/**
 * Search component
 *
 * Provides a utility for users to search through the database for projects or researchers
 * depending on their user type.
 *
 * @author Odera Anakpe
 */

import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import SearchForm from "./SearchForm";
import SearchResult from "./SearchResult";
import ResearcherSearch from "./ResearcherSearch";
import ProjectsSearch from "./ProjectsSearch";

const Search = () => {
  const { state } = useAuthContext();

  return (
    <div>
      {!state.signedIn && (
        <div className="max-w-md mx-auto mt-10 p-4 border border-red-400 bg-red-100 rounded-md shadow">
          <p className="text-center text-red-700 font-semibold">
            You need to sign in to use this service.
          </p>
        </div>
      )}
      {state.signedIn && state.userType === "participant" && (
        <ProjectsSearch state={state} />
      )}
      {state.signedIn && state.userType === "researcher" && (
        <ResearcherSearch state={state} />
      )}
    </div>
  );
};

export default Search;
