import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

/**
 * 
 * @author Patrick Shaw
*/
function Account() {
  const { state, signOut } = useAuthContext();
  const { signedIn, userType, gender, userId, interest } = state;
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (!signedIn) {
      navigate('/');
      return;
    }

    fetch("https://w20012045.nuwebspace.co.uk/kv6002/signinsubsystem/api/userdata", {
      method: 'GET',
      headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') }),
    })
      .then(response => {
        return response.status === 200 ? response.json() : [];
      })
      .then(json => setDetails(json))
      .catch(err => {
        console.log(err.message);
      });
  }, [signedIn, navigate]);

  if (!signedIn) {
    return null;
  }

  return (
    <>
      <div className="text-center my-4">
        <h2 className="text-2xl font-bold my-2">Account ({userType})</h2>
        {userType === "participant"  && (<h2 className="text-2xl font-bold my-2">Interest: {interest}</h2>)}
        <h3 className="text-2xl font-bold my-2">ID: {userId}</h3>
        <div className="mt-4">
          {details.map((detail, index) => (
            <div key={index} className="mb-4">
              <p>First Name: {detail.firstname}</p>
              <p>Last Name: {detail.lastname}</p>
              <p>Gender: {gender}</p>
              <p>Age: {detail.age}</p>
              <p>Username: {detail.username}</p>
              <p>Email: {detail.email}</p>
              <p>Address: {detail.address}</p>
              
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Account;