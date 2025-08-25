import React, { useState } from "react";
import {doCreateUserWithEmailAndPassword} from "../../../firebase/auth";
import googleIcon from '../../../assets/google-icon.png';
import styles from "../sign-in/sign-in.module.css";
function SignUpCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("weak");

    const onSubmit = async (e) => {
        e.preventDefault();
    
        if (!isLoggingIn) {
          setIsLoggingIn(true);
          try {
      const credential = await doCreateUserWithEmailAndPassword(email, password);
      const uid = credential?.user?.uid;
    //   navigate("/dashboard");
      console.log("User signed up:", credential?.user ?? credential);
          } catch (error) {
            setErrorMessage("Could not create account. Please try again.");
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


        const checkPasswordStrength = (password) => {
          let score = 0;
          
          // Length check
          if (password.length >= 8) score++;
          if (password.length >= 12) score++;
          
          // Character type checks
          if (/[A-Z]/.test(password)) score++;
          if (/[a-z]/.test(password)) score++;
          if (/\d/.test(password)) score++;
          if (/[!@#$%^&*]/.test(password)) score++;
          
          // Return strength level
          if (score <= 2) return "weak";
          if (score <= 4) return "medium";
          return "strong";
        };

        const PasswordChecker = (password) =>{
            const minLength = 8;
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumber = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*]/.test(password);

            if (password.length < minLength) {
                return "Password must be at least 8 characters long.";
            }
            if (!hasUpperCase) {
                return "Password must contain at least one uppercase letter.";
            }
            if (!hasLowerCase) {
                return "Password must contain at least one lowercase letter.";
            }
            if (!hasNumber) {
                return "Password must contain at least one number.";
            }
            if (!hasSpecialChar) {
                return "Password must contain at least one special character.";
            }
            return null; // Password is valid
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
          <p className={styles.loginTitle}>Create Account</p>
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
            <label className={styles.inputLabel} htmlFor="password">
              Password
              {}
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`${styles.loginInput} ${passwordError ? styles.inputError : ''}`}
                id="password"
                value={password}
                onChange={(e) => {
                  const newPassword = e.target.value;
                  setPassword(newPassword);
                  const error = PasswordChecker(newPassword);
                
                  setIsPasswordValid(!error);
                  setPasswordStrength(checkPasswordStrength(newPassword));
                }}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            
            {password && (
              <div className={styles.strengthIndicator}>
                <div className={styles.strengthLabel}>
                  Password Strength: <span className={styles[passwordStrength]}>{passwordStrength}</span>
                </div>
                <div className={styles.strengthBar}>
                  <div 
                    className={`${styles.strengthBarFill} ${styles[passwordStrength]}`}
                    style={{
                      width: passwordStrength === 'weak' ? '33%' : 
                            passwordStrength === 'medium' ? '66%' : '100%'
                    }}
                  />
                </div>
              </div>
            )}

            <div className={styles.passwordRequirements}>
              <small>Password must contain:</small>
              <ul>
                <li className={password.length >= 8 ? styles.valid : styles.invalid}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(password) ? styles.valid : styles.invalid}>
                  One uppercase letter
                </li>
                <li className={/[a-z]/.test(password) ? styles.valid : styles.invalid}>
                  One lowercase letter
                </li>
                <li className={/\d/.test(password) ? styles.valid : styles.invalid}>
                  One number
                </li>
                <li className={/[!@#$%^&*]/.test(password) ? styles.valid : styles.invalid}>
                  One special character (!@#$%^&*)
                </li>
              </ul>
            </div>
          </div>

        <div className={styles.buttonGroup}>
          <button
            className={styles.loginButton}
            type="submit"
            disabled={isLoggingIn || !isPasswordValid}
          >
            {isLoggingIn ? "Creating account..." : "Create Account"}
          </button>

          <button type="button" className={styles.googleButton} onClick={googleSignIn}>
            <img src={googleIcon} alt="Google" className={styles.googleIcon} />
            <span>Sign in with Google</span>
          </button>
             <a href="/" className={styles.signupLink}>
          Already have an account? Sign In
        </a>
        </div>

          {errorMessage && (
            <div className={styles.errorMessage} role="alert">
              {errorMessage}
            </div>
          )}
        </form>

   
        </div>
      </div>
      
    </div>
    </>
    
    
  );
}

export default SignUpCard;