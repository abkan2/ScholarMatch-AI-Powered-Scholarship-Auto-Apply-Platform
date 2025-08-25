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
  const [idToken, setIdToken] = useState(null);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initUser);
    return unsubscribe;
  }, []);

  // Handle token refresh
  useEffect(() => {
    let refreshInterval;
    
    const updateToken = async () => {
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken(true);
          setIdToken(token);
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }
    };

    if (currentUser) {
      // Initial token fetch
      updateToken();
      
      // Set up refresh interval (every 55 minutes)
      refreshInterval = setInterval(updateToken, 55 * 60 * 1000);
      
      // Set up token change listener
      const unsubscribe = auth.onIdTokenChanged(async (user) => {
        if (user) {
          const token = await user.getIdToken();
          setIdToken(token);
        } else {
          setIdToken(null);
        }
      });

      return () => {
        clearInterval(refreshInterval);
        unsubscribe();
      };
    }
  }, [currentUser]);

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    idToken,

  };

  async function initUser(user) {
    if (user) {
      try {
        // Get fresh token on init
        const token = await user.getIdToken(true);
        setIdToken(token);
        setCurrentUser({...user});
        setUserLoggedIn(true);
      } catch (error) {
        console.error('Error initializing user:', error);
        setCurrentUser(null);
        setUserLoggedIn(false);
        setIdToken(null);
      }
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
      setIdToken(null);
    }
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}