import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
/**
 *
 * @author Patrick Shaw
 */
function SignIn() {
  const { state, signIn, signOut } = useAuthContext();
  const { signedIn, userType } = state;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (checkTokenExpiration(token)) {
        signOut();
      } else {
        signIn(token);
      }
    }

    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && checkTokenExpiration(token)) {
        signOut();
        localStorage.removeItem("token");
        toast.error("Session has expired, please sign in again.");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const checkTokenExpiration = (token) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  };

  const handleSignIn = () => {
    const encodedString = btoa(`${username}:${password}`);

    fetch(
      "https://w20012045.nuwebspace.co.uk/kv6002/signinsubsystem/api/token",
      {
        method: "GET",
        headers: new Headers({ Authorization: "Basic " + encodedString }),
      }
    )
      .then((response) => {
        if (response.status === 200) {
          setSignInError(false);
          toast.success("Signed in successfully!");
        } else {
          setSignInError(true);
          toast.error("Incorrect username and/or password.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          signIn(data.token);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleSignOut = () => {
    signOut();
    localStorage.removeItem("token");
  };

  const bgColour = signInError ? "bg-red-200" : "bg-gray-100";
  const buttonStyle =
    "py-2 px-4 mx-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200";

  return (
    <div className="flex items-center justify-center space-x-2">
      {!signedIn && (
        <>
          <input
            type="text"
            placeholder="Username"
            className={`p-2 rounded-md ${bgColour} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className={`p-2 rounded-md ${bgColour} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <input
            type="submit"
            value="Sign In"
            className={buttonStyle}
            onClick={handleSignIn}
          />
          <Link to="/signup" className={buttonStyle}>
            Sign Up
          </Link>
        </>
      )}
      {signedIn && (
        <>
          <input
            type="submit"
            value="Sign Out"
            className={buttonStyle}
            onClick={handleSignOut}
          />
          <Link to="/account" className={buttonStyle}>
            Account
          </Link>
        </>
      )}
    </div>
  );
}

export default SignIn;
