import { useAuthContext } from "../contexts/AuthContext";

/**
 * Dialog window
 *
 * Used to show more information on the page
 *
 * @author Odera Anakpe
 *
 */
const Dialog = ({ show, onClose, project }) => {
  if (!show) {
    return null;
  }
  const { state } = useAuthContext();

  const handleApply = () => {
    // Logic to apply for the project
    console.log("Applying for project:", project.project_name);
    onClose(); // Close the dialog after applying
  };
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xl text-blue-700">
            {project.project_name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <p className="text-gray-700">{project.project_desc}</p>

        <div>
          <h3 className="font-semibold">Institution:</h3>
          <p className="text-gray-600">{project.institution_name}</p>
        </div>

        <div>
          <h3 className="font-semibold">Status:</h3>
          <p
            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${
              project.status === "accepting applications"
                ? "bg-green-100 text-green-800"
                : project.status === "not accepting applications"
                ? "bg-yellow-100 text-yellow-800"
                : project.status === "closed"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </p>
        </div>

        {project.contributors && project.contributors.length > 0 && (
          <div>
            <h3 className="font-semibold">Contributors:</h3>
            <ul>
              {project.contributors.map((contributor, index) => (
                <li key={index} className="ml-4 list-disc">
                  {contributor.first_name} {contributor.last_name} (
                  {contributor.role})
                </li>
              ))}
            </ul>
          </div>
        )}
        {state.userType === "participant" &&
          project.status === "accepting applications" && (
            <button
              onClick={handleApply}
              className="mt-4 w-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Apply for Project
            </button>
          )}
      </div>
    </div>
  );
};

export const ParticipantDialog = ({ show, onClose, participant }) => {
  if (!show) {
    return null;
  }

  const handleSendInvite = () => {
    // Placeholder for sending an invite logic
    console.log(
      `Sending study invite to ${participant.firstname} ${participant.lastname}`
    );
    onClose(); // Optionally close the dialog after sending the invite
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-blue-600">
            {participant.firstname} {participant.lastname}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-600"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div>
          <h3 className="font-semibold">Address:</h3>
          <p className="text-gray-600">{participant.Address}</p>
        </div>
        <div>
          <h3 className="font-semibold">Interests:</h3>
          <ul className="list-disc list-inside space-y-1">
            {participant.interests.map((interest, index) => (
              <li key={index} className="text-gray-600">
                {interest.interest}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleSendInvite}
          className="mt-4 w-full text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Send Study Invite
        </button>
      </div>
    </div>
  );
};

export default Dialog;
