import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
/**
 * 
 * @author Patrick Shaw
 */
function Account() {
  const { state, signOut } = useAuthContext();
  const { signedIn, userType, gender, userId } = state;
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (!signedIn) {
      navigate('/');
      return;
    }

    fetch("https://w20012045.nuwebspace.co.uk/kv6002/signinsubsystem/api/userdata", {
      method: 'GET',
      headers: new Headers({
        "Authorization": "Bearer " + localStorage.getItem('token')
      }),
    })
    .then(response => {
      return response.status === 200 ? response.json() : []
    })
    .then(json => setDetails(json))
    .catch(err => {
      console.log(err.message);
    })
  }, [signedIn, navigate]);

  const handleDeleteUser = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      fetch("https://w20012045.nuwebspace.co.uk/kv6002/signinsubsystem/api/userdata", {
        method: 'DELETE',
        headers: new Headers({
          "Authorization": "Bearer " + localStorage.getItem('token')
        }),
      })
      .then(response => {
        if (response.status === 200) {
          localStorage.removeItem('token');
          signOut();
          navigate('/');
        } else {
          console.log('Error deleting user account');
        }
      })
      .catch(err => {
        console.log(err.message);
      })
    }
  }

  if (!signedIn) {
    return null;
  }

  return (
    <>
      <div className="text-center my-4">
        <h2 className="text-2xl font-bold my-2">Account ({userType})</h2>
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
        <button onClick={handleDeleteUser} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Delete Account
        </button>
      </div>
    </>
  );
}

export default Account;