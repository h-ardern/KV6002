import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthContext } from '../contexts/AuthContext';
/**
 * 
 * @author Patrick Shaw
 */
function SignUp() {
  const navigate = useNavigate();
  const { state, signIn } = useAuthContext();
  const { signedIn } = state;

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    email: '',
    age: '',
    genderID: '',
    addressNumber: '',
    addressStreet: '',
    addressCity: '',
    addressCountry: '',
  });

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (signedIn) {
      navigate('/');
    } // if signed in sent back to home page

    fetch('https://w20012045.nuwebspace.co.uk/kv6002/merged/api/country')
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }, [signedIn, navigate]); // fetches relevant countries for a dropdown box on the signUp form

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setFormData({ ...formData, genderID: parseInt(e.target.value) });
  };

  const validateForm = () => {
    const {
      username,
      password,
      confirmPassword,
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
      toast.error('Username must be at least 5 characters long.'); //username validation
      return false;
    }

    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      toast.error('Password must be at least 8 characters long and contain at least one digit and one letter.'); // password validation
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.'); // confirm password validation
      return false;
    }

    if (!/^[a-zA-Z]+$/.test(firstname) || !/^[a-zA-Z]+$/.test(lastname)) {
      toast.error('First name and last name can only contain letters.'); // firstname and last name validation
      return false;
    }

    if (firstname.length > 25) {
      toast.error('First name cannot exceed 25 characters.'); // firstname validation
      return false;
    }

    if (lastname.length > 25) {
      toast.error('Last name cannot exceed 25 characters.'); // lastname validation
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.'); // email validation
      return false;
    }

    if (age < 18 || age > 120) {
      toast.error('Age must be between 18 and 120.'); // age validation
      return false;
    }

    if (!formData.genderID) {
      toast.error('Please select a gender.'); // gender must be selected
      return false;
    }

    if (!/^\d+$/.test(addressNumber)) {
      toast.error('Please enter a valid address number.'); // address number validation (*1 = All inputs for the address are inputed in the same cell for the database,"1, street, village, Australia")
      return false;
    }

    if (addressNumber.length > 10) {
      toast.error('Address number cannot exceed 10 characters.'); // address number validation (*1)
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(addressStreet)) {
      toast.error('Please enter a valid street name.'); // address Street validation (*1)
      return false;
    }

    if (addressStreet.length > 50) {
      toast.error('Street name cannot exceed 50 characters.'); // address Street validation (*1)
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(addressCity)) {
      toast.error('Please enter a valid city name.'); // address City validation (*1)
      return false;
    }

    if (addressCity.length > 50) {
      toast.error('City name cannot exceed 50 characters.'); // address City validation (*1)
      return false;
    }

    if (!addressCountry) {
      toast.error('Please select a country.'); // address Country validation (*1)
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
      usertypeID: 2, // Set the usertypeID to 2 for researchers
    };

    const encodedString = btoa(`${formData.username}:${formData.password}`);

    fetch('https://w20012045.nuwebspace.co.uk/kv6002/merged/api/createaccount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          toast.success('Registration successful!');
          return fetch('https://w20012045.nuwebspace.co.uk/kv6002/merged/api/token', {
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
          signIn(token);
          navigate('/');
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
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">Not A Researcher? Participant Sign-Up Link Here.</a>
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
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <h2 className="text-2xl font-bold my-2">Details</h2>
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
                <option value="">Select gender</option>
                <option value={2}>Male</option>
                <option value={1}>Female</option>
                <option value={3}>Other</option>
              </select>
            </div>
            <h2 className="text-2xl font-bold my-2">Address</h2>
            <div>
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
            <button type="submit">Sign Up</button>
          </form>   
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      
    </>
  );
}

export default SignUp;
