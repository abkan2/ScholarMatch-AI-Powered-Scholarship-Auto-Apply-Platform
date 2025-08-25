import React, { useState } from 'react';
import styles from './sign-in.module.css';
import googleIcon from '../../../assets/google-icon.png';


import { useNavigate, Navigate } from 'react-router-dom';

import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth';
import { firestore } from '../../../firebase/firebase';
import {useAuth} from "../../../contexts/authContext"
import{doc, getDoc} from "firebase/firestore"




function SignInCard() {
  const {userLoggedIn} = useAuth() || {}
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const navigate = useNavigate()

  const fetchLastPage = async (uid) =>{
    // Guard against undefined uid - required by Firestore rules
    if (!uid) {
      console.warn('fetchLastPage called without uid, returning root "/"');
      return "/";
    }

    try{
      const progressRef = doc(firestore, "progress", uid);
      const progressDoc = await getDoc(progressRef);

      // If no progress doc exists yet, that's ok - return home
      if (!progressDoc.exists()) {
        return "/";
      }

      const data = progressDoc.data();
      // Validate required fields exist (matching rules schema)
      if (!data || typeof data.level !== 'number') {
        console.warn('Progress doc missing required fields:', data);
        return "/";
      }

      // Map progress level to appropriate page path
      // Adjust these paths based on your app's routing
      switch(data.level) {
        case 0:
          return "/onboarding";
        case 1:
          return "/dashboard";
        default:
          return "/";
      }
    }
    catch(error)
    {
      // Log detailed error for debugging rule violations
      console.error("Error fetching progress:", {
        uid,
        code: error?.code,
        message: error?.message,
        raw: error
      });
      
      if (error?.code === 'permission-denied') {
        setErrorMessage("Access denied. Please sign in again.");
      }
    }
    return "/";
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggingIn) {
      setIsLoggingIn(true);
      try {
  const credential = await doSignInWithEmailAndPassword(email, password);
  const uid = credential?.user?.uid;
  const lastPage = await fetchLastPage(uid); // Fetch the last completed page
  navigate(lastPage); // Navigate to the appropriate page
  console.log("User signed in:", credential?.user ?? credential);
      } catch (error) {
        setErrorMessage("Invalid Credentials. Please try again.");
      } finally {
        setIsLoggingIn(false); // Ensure this is set to false after login attempt
      }
    }
  };

  const googleSignIn = async(e)=>{
    e.preventDefault()
    try{
  const credential = await doSignInWithGoogle()
  const uid = credential?.user?.uid || credential?.uid || null;
  const lastPage = await fetchLastPage(uid);
      navigate(lastPage);
    }
    catch(error)
    {
      setErrorMessage("Failed to log in with Google. Please try again.")
    }
  }

  if (userLoggedIn)
  {
    return <Navigate to ="/" replace = {true}/>;
  }

  function GetTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  }

  return (
    <>

    <div className={styles.pageBackground}>

      
      <div className={styles.card}>
        <div className={styles.welcomeSection}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>Scholar Match</h1>
          <p className={styles.welcomeSubtitle}>Your Path to Academic Success Starts Here</p>
        </div>
        <div className={styles.wavesBackground}></div>
      </div>

        <div className={styles.loginCardContainer}>
        <div className={styles.greetingText}>
          {/* <h2 className={styles.welcomeBack}>Good {GetTimeOfDay()}!</h2> */}
          <p className={styles.loginTitle}>Login</p>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="email">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className={styles.loginInput}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className={styles.loginInput}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className={styles.rememberForgot}>
            <label className={styles.remember}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember
            </label>
            <a href="/forgot-password" className={styles.forgotPassword}>
              Forgot Password?
            </a>
          </div>

          <button 
            className={styles.loginButton} 
            type="submit" 
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging In..." : "SUBMIT"}
          </button>

          <button type="button" className={styles.googleButton} onClick={googleSignIn}>
            <img src={googleIcon} alt="Google" className={styles.googleIcon} />
            <span>Sign in with Google</span>
          </button>

          {errorMessage && (
            <div className={styles.errorMessage} role="alert">
              {errorMessage}
            </div>
          )}
        </form>

        <a href="/signup" className={styles.signupLink}>
          New here? click here to create account
        </a>
        </div>
      </div>
      
    </div>
    </>
    
    
  );
}

export default SignInCard;
