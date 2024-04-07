import React, { createContext, useContext, useReducer } from "react";

/**
 * 
 * @author Patrick Shaw
*/

export const signInOutAction = "SIGN_INOUT";
export const setUserIdAction = "SET_USER_ID";
export const setUserTypeAction = "SET_USER_TYPE";
export const setGenderAction = "SET_GENDER";
export const setInterestAction = "SET_INTEREST_ID";

const initialState = {
  signedIn: false,
  userId: null,
  userType: null,
  gender: null,
  interest: null,
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
    case setInterestAction:
      return { ...state, interest: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const parseUserTypeAndGenderFromToken = (token) => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub;
      const usertypeID = payload.usertypeID;
      const genderID = payload.genderID;
      const interestID = payload.interestID;
      const userType = usertypeID === 2 ? "researcher" 
      : usertypeID === 1 ? "participant" 
      : null;
      const gender = genderID === 1 ? "female" 
      : genderID === 2 ? "male" 
      : genderID === 3 ? "other" 
      : null;
      const interest = interestID === 1 ? "Enviromental" 
      : interestID === 2 ? "Technology" 
      : interestID === 3 ? "Psychology and Neuroscience" 
      : interestID === 4 ? "Work and Education" 
      : interestID === 5 ? "Health and Medicine" 
      : null;
      return { userId, userType, gender, interest };
    }
    return { userId: null, userType: null, gender: null, interest: null };
  };

  const signIn = (token) => {
    const { userId, userType, gender, interest } = parseUserTypeAndGenderFromToken(token);
    dispatch({ type: signInOutAction, payload: true });
    dispatch({ type: setUserIdAction, payload: userId });
    dispatch({ type: setUserTypeAction, payload: userType });
    dispatch({ type: setGenderAction, payload: gender });
    dispatch({ type: setInterestAction, payload: interest });
  };

  const signOut = () => {
    dispatch({ type: signInOutAction, payload: false });
    dispatch({ type: setUserIdAction, payload: null });
    dispatch({ type: setUserTypeAction, payload: null });
    dispatch({ type: setGenderAction, payload: null });
    dispatch({ type: setInterestAction, payload: null });
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