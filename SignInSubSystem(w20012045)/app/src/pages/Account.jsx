import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

function Account() {
  const { state } = useAuthContext();
  const { signedIn, userType, gender, userId, interests, firstName, lastName, age, username, email, address } = state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!signedIn) {
      navigate('/');
    }
  }, [signedIn, navigate]);

  if (!signedIn) {
    return null;
  }

  return (
    <>
      <div className="text-center my-4">
        <h2 className="text-2xl font-bold my-2">Account ({userType})</h2>
        {userType === "participant" && (
          <h2 className="text-2xl font-bold my-2">Interests: {interests}</h2>
        )}
        <h3 className="text-2xl font-bold my-2">ID: {userId}</h3>
        <div className="mt-4">
          <p>First Name: {firstName}</p>
          <p>Last Name: {lastName}</p>
          <p>Gender: {gender}</p>
          <p>Age: {age}</p>
          <p>Username: {username}</p>
          <p>Email: {email}</p>
          <p>Address: {address}</p>
        </div>
      </div>
    </>
  );
}

export default Account;