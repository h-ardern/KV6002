/**
 * Component for handling search when the user is a researcher
 *
 * @author Odera Anakpe
 */
import React, { useEffect, useState } from "react";
import ProjectsSearch from "./ProjectsSearch";
import SearchForm from "./SearchForm";
import { ParticipantDialog } from "./Dialog";

const ResearcherSearch = ({ state }) => {
  const [activeTab, setActiveTab] = useState("participants");

  const renderContent = () => {
    switch (activeTab) {
      case "participants":
        return <SearchParticipants state={state} />;
      case "projects":
        return <ProjectsSearch state={state} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex border-b">
        <button
          className={`flex-1 p-4 text-lg ${
            activeTab === "participants"
              ? "text-blue-500 border-b-4 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("participants")}
        >
          Participants
        </button>
        <button
          className={`flex-1 p-4 text-lg ${
            activeTab === "projects"
              ? "text-blue-500 border-b-4 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("projects")}
        >
          Projects
        </button>
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default ResearcherSearch;

const SearchParticipants = ({ state }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [university, setUniversity] = useState("");
  const [interests, setInterests] = useState("");
  const [status, setStatus] = useState("All");
  const [participantData, setParticipantData] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  useEffect(() => {
    fetch("https://w20012045.nuwebspace.co.uk/kv6002/merged/api/participants")
      .then((response) => {
        if (response.status === 200) return response.json();
      })
      .then((json) => {
        setParticipantData(json);
      });
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const lowerCaseInterestSearch = interests.toLowerCase();

    const results = participantData.filter((participant) => {
      const matchesName = lowerCaseSearchTerm
        ? participant.firstname.toLowerCase().includes(lowerCaseSearchTerm) ||
          participant.lastname.toLowerCase().includes(lowerCaseSearchTerm)
        : true;
      const matchesInterest = lowerCaseInterestSearch
        ? participant.interests.some((interest) =>
            interest.interest.toLowerCase().includes(lowerCaseInterestSearch)
          )
        : true;
      return matchesName && matchesInterest;
    });
    setFilteredParticipants(results);
  }, [searchTerm, participantData, interests]);

  const handleCloseDialog = () => {
    setSelectedParticipant(null);
  };

  return (
    <>
      {state.signedIn && (
        <>
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
            showInterest
          />
          <div className="space-y-2 mt-4">
            {filteredParticipants.map((participant) => (
              <div
                key={participant.id}
                onClick={() => setSelectedParticipant(participant)}
                className="cursor-pointer p-2 hover:bg-gray-100 rounded shadow"
              >
                {participant.firstname} {participant.lastname}
              </div>
            ))}
          </div>
          <ParticipantDialog
            show={!!selectedParticipant}
            participant={selectedParticipant || {}}
            onClose={handleCloseDialog}
          />
        </>
      )}
    </>
  );
};
