import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import ProjectsList from './ParticipantStatus';
import ProjectInvitations from './ProjectInvitations';

// Author @Harry Wallis

const UserDashboard = () => {
  const { state: { userId, userType } } = useAuthContext();

  // Returns page for participant or researcher depending on who's logged in
  return (
    <div>
      {userType === "participant" ? <ProjectsList userId={userId} /> : <ProjectInvitations userId={userId} />}
    </div>
  );
};

export default UserDashboard;
