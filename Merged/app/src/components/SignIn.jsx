import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
/**
 * 
 * @author Patrick Shaw
 */
function SignIn() {
  const { state, signIn, signOut } = useAuthContext();
  const { signedIn } = state;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signInError, setSignInError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (checkTokenExpiration(token)) {
        signOut();
      } else {
        signIn(token);
      }
    }

    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token && checkTokenExpiration(token)) {
        signOut();
        localStorage.removeItem('token');
        toast.error('Session has expired, please sign in again.');
      }
    }, 10000); // check if token has expired every 10 seconds, and signs out if it has expired

    return () => clearInterval(interval);
  }, []);

  const checkTokenExpiration = (token) => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  };

  const handleSignIn = () => {
    const encodedString = btoa(`${username}:${password}`);

    fetch('https://w20012045.nuwebspace.co.uk/kv6002/merged/api/token', {
      method: 'GET',
      headers: new Headers({ Authorization: 'Basic ' + encodedString }),
    })
      .then((response) => {
        if (response.status === 200) {
          setSignInError(false);
          toast.success('Signed in successfully!');
        } else {
          setSignInError(true);
          toast.error('Incorrect username and/or password.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          signIn(data.token);
        }
      })
      .catch((error) => console.log(error));
  }; // checks if password and username are correct, if they are you are signed in and token is stored in local storage, if not you are prompted to sign in again

  const handleSignOut = () => {
    signOut();
    localStorage.removeItem('token');
  };

  const bgColour = signInError ? 'bg-red-200' : 'bg-slate-100';

  return (
    <div className="bg-slate-800 p-2 text-md text-right">
      {!signedIn && (
        <div className="flex items-center justify-end">
          <input
            type="text"
            placeholder="username"
            className={`p-1 mx-2 rounded-md ${bgColour}`}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            className={`p-1 mx-2 rounded-md ${bgColour}`}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <input
            type="submit"
            value="Sign In"
            className="py-1 px-2 mx-2 bg-green-100 hover:bg-green-500 rounded-md cursor-pointer"
            onClick={handleSignIn}
          />
          <Link
            to="/signup"
            className="py-1 px-2 mx-2 bg-green-100 hover:bg-green-500 rounded-md cursor-pointer"
          >
            Sign Up
          </Link>
        </div> // shows username, password, sign in, and sign up inputs if not signed in
      )}
      {signedIn && (
        <div>
          <input
            type="submit"
            value="Sign Out"
            className="py-1 px-2 mx-2 bg-green-100 hover:bg-green-500 rounded-md cursor-pointer"
            onClick={handleSignOut}
          /> 
          <Link
            to="/account"
            className="py-1 px-2 mx-2 bg-green-100 hover:bg-green-500 rounded-md cursor-pointer"
          > 
            Account
          </Link>
        </div> // Shows Signout and account inputs if signed in
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default SignIn;