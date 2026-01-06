"use client";

import { auth, db } from "@/firebase.js";
import { closeModal } from "@/Redux/modalSlice";
import { RootState } from "@/Redux/store";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type ViewMode = "login" | "signup" | "forgotPassword";

const LoginModal = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  //   const [isSignedUp, setIsSignedUp] = useState(false);
  const [ViewMode, setViewMode] = useState<ViewMode>("login");

  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  const isOpen = useSelector((state: RootState) => state.modal.isModalOpen);

  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        dispatch(closeModal());
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, dispatch]);
  
  if (!isOpen) return null;
  
  //   Helper to reset input fields when switching views
  const resetForm = (mode: ViewMode) => {
    setError(null);
    setEmail("");
    setPassword("");
    // setName('');
    setViewMode(mode);
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (ViewMode === "signup") {
        // Sign Up flow
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // --- This is how you link them
        const userUid = userCredential.user.uid;
        const userDocRef = doc(db, "users", userUid);

        await setDoc(doc(db, "users", userUid), {
          email: email,
          // name: name | null,
          isSubscribed: false,
          createdAt: new Date().toISOString(),
        });
        // --- Linking Complete

        // Update the display name immediately after creation
        /*--if(name) {
                await updateProfile(userCredential.user, { displayName: name });
            }--*/
      } else if (ViewMode === "login") {
        //   Login flow
        await signInWithEmailAndPassword(auth, email, password);
      }
      dispatch(closeModal());
      router.push("/for-you");
    } catch (err: any) {
      console.error("Auth Error Code:", err.code);
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Try logging in instead.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      dispatch(closeModal());
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setLoading(true)
    try {
      await signInAnonymously(auth);
      dispatch(closeModal());
      router.push("/for-you");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
      resetForm("login"); /*Goes back to login screen after sending */
    } catch (err: any) {
      setError(err.message);
    }
  };

  // --- Conditionl Rendering based on viewMode ---

  const renderForgotPasswordView = () => {
    return (
      <div className="auth__wrapper">
        <div className="auth" ref={modalRef}>
          <div className="auth__content">
            <div className="auth__title">Reset your password</div>
            <form onSubmit={handleForgotPassword} className="auth__main--form">
              <input
                className="auth__main--input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
              />
              <button type="submit" className="btn">
                <span>Send reset password link</span>
              </button>
            </form>
          </div>
          <button
            onClick={() => resetForm("login")}
            className="auth__switch--btn"
          >
            Go to login
          </button>
          <div className="auth__close--btn">
            {/* <button onClick={() => dispatch(closeModal())}> */}
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
                fill="currentColor"
              ></path>
            </svg>
            {/* </button> */}
          </div>
        </div>
      </div>
    );
  };

  const renderAuthForm = () => (
    <div className="auth__wrapper">
      <div className="auth" ref={modalRef}>
        <div className="auth__content">
          <div className="auth__title">
            {ViewMode === "signup"
              ? "Sign up to Summarist"
              : "Log in to Summarist"}
          </div>
          {ViewMode === "login" && (
            <button
              onClick={handleGuestLogin}
              className="btn guest__btn--wrapper"
              disabled={loading}
            >
              {loading ? (<div className="btn--spinner"></div>) : (
              <><figure className="google__icon--mask guest__icon--mask">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 448 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
                  </svg>
                </figure><div>Login as a Guest</div></>)}
            </button>
          )}
          <div className="auth__separator">
            <span className="auth__separator--text">or</span>
          </div>
          <button
            onClick={handleGoogleLogin}
            className="btn google__btn--wrapper"
            disabled={loading}
          >
            {loading ? (
              <div className="btn--spinner"></div>
            ) : (
              <>
                <figure className="google__icon--mask">
                  <img
                    alt="google"
                    srcSet="/assets/google.png 1x, /assets/google.png 2x"
                    src="/assets/google.png"
                    width="100"
                    height="100"
                    decoding="async"
                    data-nimg="1"
                    loading="lazy"
                    style={{ color: "transparent" }}
                  />
                </figure>
                <div>Login with Google</div>
              </>
            )}
          </button>
          <div className="auth__separator">
            <span className="auth__separator--text">or</span>
          </div>
          <form onSubmit={handleAuthAction} className="auth__main--form">
            <input
              className="auth__main--input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email Address"
            />
            <input
              className="auth__main--input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? (
                <div className="btn--spinner"></div>
              ) : (
                <span>
                  {ViewMode === "signup" ? "Create Account" : "Login"}
                </span>
              )}
            </button>
          </form>
          {error && <p>{error}</p>}
        </div>
        <div className="auth__forgot--password">
          {ViewMode === "login" && (
            <button
              type="button"
              className="auth__forgot--password"
              onClick={() => resetForm("forgotPassword")}
            >
              Forgot your password?
            </button>
          )}
        </div>
        <button
          onClick={() => resetForm(ViewMode === "login" ? "signup" : "login")}
          className="auth__switch--btn"
        >
          {ViewMode === "signup"
            ? "Already have an account?"
            : "Dont have an account?"}
        </button>
        <div className="auth__close--btn">
          <button onClick={() => dispatch(closeModal())}>
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {ViewMode === "forgotPassword"
        ? renderForgotPasswordView()
        : renderAuthForm()}
    </>
  );
};

export default LoginModal;
