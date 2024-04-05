import React, { createContext, useContext, useReducer } from "react";

export const signInOutAction = "SIGN_INOUT";
export const setUserIdAction = "SET_USER_ID";
export const setUserTypeAction = "SET_USER_TYPE";
export const setGenderAction = "SET_GENDER";
export const setInterestsAction = "SET_INTERESTS";
export const setUserDataAction = "SET_USER_DATA";

const initialState = {
  signedIn: false,
  userId: null,
  userType: null,
  gender: null,
  interests: "",
  firstName: "",
  lastName: "",
  age: null,
  username: "",
  email: "",
  address: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case signInOutAction:
      return { ...state, signedIn: action.payload };
    case setUserIdAction:
      return { ...state, userId: action.payload };
    case setUserTypeAction:
      return { ...state, userType: action.payload };
    case setGenderAction:
      return { ...state, gender: action.payload };
    case setInterestsAction:
      return { ...state, interests: action.payload };
    case setUserDataAction:
      const { firstname, lastname, age, username, email, address } = action.payload;
      return {
        ...state,
        firstName: firstname,
        lastName: lastname,
        age: age,
        username: username,
        email: email,
        address: address,
      };
    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const parseDataFromToken = (token) => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub;
      const usertypeID = payload.usertypeID;
      const genderID = payload.genderID;
      const userType = usertypeID === 2 ? "researcher" : usertypeID === 1 ? "participant" : null;
      const gender = genderID === 1 ? "female" : genderID === 2 ? "male" : genderID === 3 ? "other" : null;
      return { userId, userType, gender };
    }
    return { userId: null, userType: null, gender: null };
  };

  const fetchUserInterests = (userId, token) => {
    fetch("https://w20012045.nuwebspace.co.uk/kv6002/signinsubsystem/api/interests", {
      method: 'GET',
      headers: new Headers({
        "Authorization": "Bearer " + token
      }),
    })
      .then(response => {
        return response.status === 200 ? response.json() : [];
      })
      .then(data => {
        const interestIDs = data.map((interest) => interest.interestID);
        const interestsString = interestIDs.map((id) => {
          switch (id) {
            case 1:
              return "Environmental";
            case 2:
              return "Technology";
            case 3:
              return "Psychology and Neuroscience";
            case 4:
              return "Work and Education";
            case 5:
              return "Health and Medicine";
            default:
              return "";
          }
        }).join(", ");
        dispatch({ type: setInterestsAction, payload: interestsString });
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const fetchUserData = (userId, token) => {
    fetch("https://w20012045.nuwebspace.co.uk/kv6002/signinsubsystem/api/userdata", {
      method: 'GET',
      headers: new Headers({
        "Authorization": "Bearer " + token
      }),
    })
      .then(response => {
        return response.status === 200 ? response.json() : {};
      })
      .then(data => {
        dispatch({ type: setUserDataAction, payload: data[0] });
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const signIn = (token) => {
    const { userId, userType, gender } = parseDataFromToken(token);
    dispatch({ type: signInOutAction, payload: true });
    dispatch({ type: setUserIdAction, payload: userId });
    dispatch({ type: setUserTypeAction, payload: userType });
    dispatch({ type: setGenderAction, payload: gender });
    fetchUserInterests(userId, token);
    fetchUserData(userId, token);
  };

  const signOut = () => {
    dispatch({ type: signInOutAction, payload: false });
    dispatch({ type: setUserIdAction, payload: null });
    dispatch({ type: setUserTypeAction, payload: null });
    dispatch({ type: setGenderAction, payload: null });
    dispatch({ type: setInterestsAction, payload: "" });
    dispatch({ type: setUserDataAction, payload: {} });
  };

  return (
    <AuthContext.Provider value={{ state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};