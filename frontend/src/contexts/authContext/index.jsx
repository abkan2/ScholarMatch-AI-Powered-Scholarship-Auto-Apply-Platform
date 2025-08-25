import { auth } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword, doSignOut, doPasswordReset, doPasswordChange, doSendEmailVerification, doSignInWithGoogle } from '../../firebase/auth';
import React, { useContext, useEffect, useState } from 'react';

const AuthContext  = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth,initUser);
    return unsubscribe;
  },[]);

  const value = {
    currentUser,
    userLoggedIn,
    loading,

  };

  function initUser(user) {
    if (user)
    {
      setCurrentUser({...user});
      setUserLoggedIn(true);
    }
    else{
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}