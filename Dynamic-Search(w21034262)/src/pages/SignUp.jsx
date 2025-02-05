import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthContext } from '../contexts/AuthContext';

function SignUp() {
  const navigate = useNavigate();
  const { state, signIn } = useAuthContext();
  const { signedIn } = state;

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    usertypeID: 1,
    firstname: '',
    lastname: '',
    email: '',
    age: '',
    genderID: 1,
    addressNumber: '',
    addressStreet: '',
    addressCity: '',
    addressCountry: '',
  });

  const [selectedInterest, setSelectedInterest] = useState(1);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (signedIn) {
      navigate('/');
    }

    // Fetch the list of countries from the API
    fetch('https://w20012045.nuwebspace.co.uk/kv6002/signinsubsystem/api/country')
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }, [signedIn, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (e) => {
    setFormData({ ...formData, usertypeID: parseInt(e.target.value) });
  };

  const handleGenderChange = (e) => {
    setFormData({ ...formData, genderID: parseInt(e.target.value) });
  };

  const validateForm = () => {
    const {
      username,
      password,
      firstname,
      lastname,
      email,
      age,
      addressNumber,
      addressStreet,
      addressCity,
      addressCountry,
    } = formData;

    if (username.length < 5) {
      toast.error('Username must be at least 5 characters long.');
      return false;
    }

    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      toast.error('Password must be at least 8 characters long and contain at least one digit and one letter.');
      return false;
    }

    if (!/^[a-zA-Z]+$/.test(firstname) || !/^[a-zA-Z]+$/.test(lastname)) {
      toast.error('First name and last name can only contain letters.');
      return false;
    }

    if (firstname.length > 25) {
      toast.error('First name cannot exceed 25 characters.');
      return false;
    }

    if (lastname.length > 25) {
      toast.error('Last name cannot exceed 25 characters.');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }

    if (age < 18 || age > 120) {
      toast.error('Age must be between 18 and 120.');
      return false;
    }

    if (!/^\d+$/.test(addressNumber)) {
      toast.error('Please enter a valid address number.');
      return false;
    }

    if (addressNumber.length > 10) {
      toast.error('Address number cannot exceed 10 characters.');
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(addressStreet)) {
      toast.error('Please enter a valid street name.');
      return false;
    }

    if (addressStreet.length > 50) {
      toast.error('Street name cannot exceed 50 characters.');
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(addressCity)) {
      toast.error('Please enter a valid city name.');
      return false;
    }

    if (addressCity.length > 50) {
      toast.error('City name cannot exceed 50 characters.');
      return false;
    }

    if (!addressCountry) {
      toast.error('Please select a country.');
      return false;
    }

    return true;
  };

  
const handleSubmit = (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const { addressNumber, addressStreet, addressCity, addressCountry, ...restFormData } = formData;
  const addressString = `${addressNumber}, ${addressStreet}, ${addressCity}, ${addressCountry}`;

  const requestData = {
    ...restFormData,
    address: addressString,
  };

  const encodedString = btoa(`${formData.username}:${formData.password}`);

  fetch('https://w20012045.nuwebspace.co.uk/kv6002/signinsubsystem/api/createaccount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      if (response.ok) {
        toast.success('Registration successful!');
        // Automatically sign in the user after successful registration
        return fetch('https://w20012045.nuwebspace.co.uk/kv6002/signinsubsystem/api/token', {
          method: 'GET',
          headers: new Headers({ Authorization: 'Basic ' + encodedString }),
        });
      } else if (response.status === 409) {
        toast.error('Username or email already exists.');
        throw new Error('Registration failed');
      } else {
        toast.error('Registration failed. Please try again.');
        throw new Error('Registration failed');
      }
    })
    .then((response) => response.json())
    .then((data) => {
      const { token } = data;
      if (token) {
        localStorage.setItem('token', token);

        if (formData.usertypeID === 1) {
          // Make a POST request to the interest endpoint only for participants
          return fetch('https://w20012045.nuwebspace.co.uk/kv6002/signinsubsystem/api/interests', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ interestID: selectedInterest }),
          })
            .then((response) => {
              if (response.ok) {
                toast.success('Interest saved successfully!');
                // Fetch the updated token with the saved interest
                return fetch('https://w20012045.nuwebspace.co.uk/kv6002/signinsubsystem/api/token', {
                  method: 'GET',
                  headers: new Headers({ Authorization: 'Basic ' + encodedString }),
                });
              } else {
                throw new Error('Failed to save interest');
              }
            })
            .then((response) => response.json())
            .then((data) => {
              const { token } = data;
              if (token) {
                signIn(token);
                localStorage.setItem('token', token);
                navigate('/');
              } else {
                throw new Error('Failed to retrieve updated token');
              }
            });
        } else {
          signIn(token);
          navigate('/');
        }
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    });
};

  return (
    <>
      {!signedIn && (
        <div className="text-center my-4">
          <h2 className="text-2xl font-bold my-2">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="usertype">User Type:</label>
              <select
                id="usertype"
                name="usertypeID"
                value={formData.usertypeID}
                onChange={handleUserTypeChange}
                required
              >
                <option value={1}>Participant</option>
                <option value={2}>Client</option>
              </select>
            </div>
            <div>
              <label htmlFor="firstname">First Name:</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="lastname">Last Name:</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="gender">Gender:</label>
              <select
                id="gender"
                name="genderID"
                value={formData.genderID}
                onChange={handleGenderChange}
                required
              >
                <option value={1}>Female</option>
                <option value={2}>Male</option>
                <option value={3}>Other</option>
              </select>
            </div>
            <div>
              <h3>Address</h3>
              <div>
                <label htmlFor="addressNumber">House/Flat Number:</label>
                <input
                  type="number"
                  id="addressNumber"
                  name="addressNumber"
                  value={formData.addressNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="addressStreet">Street:</label>
                <input
                  type="text"
                  id="addressStreet"
                  name="addressStreet"
                  value={formData.addressStreet}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="addressCity">City:</label>
                <input
                  type="text"
                  id="addressCity"
                  name="addressCity"
                  value={formData.addressCity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="addressCountry">Country:</label>
                <select
                  id="addressCountry"
                  name="addressCountry"
                  value={formData.addressCountry}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country.country}>
                      {country.country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {formData.usertypeID === 1 && (
              <div>
                <label htmlFor="interest">Interest:</label>
                <select
                  id="interest"
                  name="interest"
                  value={selectedInterest}
                  onChange={(e) => setSelectedInterest(parseInt(e.target.value))}
                  required
                >
                  <option value={1}>Enviromental</option>
                  <option value={2}>Technology</option>
                  <option value={3}>Psychology and Neuroscience</option>
                  <option value={4}>Work and Education</option>
                  <option value={5}>Health and Medicine</option>
                </select>
              </div>
            )}
            <button type="submit">Sign Up</button>
          </form>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default SignUp;