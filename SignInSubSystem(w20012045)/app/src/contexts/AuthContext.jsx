import React, { createContext, useContext, useReducer } from "react";
/**
 * 
 * @author Patrick Shaw
 */
export const signInOutAction = "SIGN_INOUT";
export const setUserTypeAction = "SET_USER_TYPE";
export const setGenderAction = "SET_GENDER";
export const setUserIdAction = "SET_USER_ID";

const initialState = {
  signedIn: false,
  userType: null,
  gender: null,
  userId: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case signInOutAction:
      return { ...state, signedIn: action.payload };
    case setUserTypeAction:
      return { ...state, userType: action.payload };
    case setGenderAction:
      return { ...state, gender: action.payload };
    case setUserIdAction:
      return { ...state, userId: action.payload };
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
      const usertypeID = payload.usertypeID;
      const genderID = payload.genderID;
      const userType = usertypeID === 2 ? "client" : usertypeID === 1 ? "participant" : null;
      const gender = genderID === 1 ? "female" : genderID === 2 ? "male" : genderID === 3 ? "other" : null;
      const userId = payload.sub; 
      return { userType, gender, userId };
    }
    return { userType: null, gender: null, userId: null };
  };

  const signIn = (token) => {
    const { userType, gender, userId } = parseUserTypeAndGenderFromToken(token);
    dispatch({ type: signInOutAction, payload: true });
    dispatch({ type: setUserTypeAction, payload: userType });
    dispatch({ type: setGenderAction, payload: gender });
    dispatch({ type: setUserIdAction, payload: userId });
  };

  const signOut = () => {
    dispatch({ type: signInOutAction, payload: false });
    dispatch({ type: setUserTypeAction, payload: null });
    dispatch({ type: setGenderAction, payload: null });
    dispatch({ type: setUserIdAction, payload: null });
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