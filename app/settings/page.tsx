"use client";

import Searchbar from "@/components/Searchbar";
import Sidebar from "@/components/Sidebar";
import { auth, firebaseConfig } from "@/firebase";
import { getPremiumStatus } from "@/getPremiumStatus";
import { openModal } from "@/Redux/modalSlice";
import { RootState } from "@/Redux/store";
import { getCheckoutUrl, getPortalUrl } from "@/stripePayments";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Settings = () => {
  // const app = initializeApp(firebaseConfig);
  // const auth = getAuth(app);
  // const email = auth.currentUser?.email;
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const isSubscribed = useSelector(
    (state: RootState) => state.auth.isSubscribed
  );

  useEffect(() => {
    // Firebase auth observer
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserEmail(user?.email || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="wrapper">
      <Searchbar />
      <Sidebar />
      <div className="container">
        {loading ? (
          <div
            className="row"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              transform: "translateY(200px)",
            }}
          >
            <div className="audio__book--spinner">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                version="1.1"
                viewBox="0 0 16 16"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 16c-2.137 0-4.146-0.832-5.657-2.343s-2.343-3.52-2.343-5.657c0-1.513 0.425-2.986 1.228-4.261 0.781-1.239 1.885-2.24 3.193-2.895l0.672 1.341c-1.063 0.533-1.961 1.347-2.596 2.354-0.652 1.034-0.997 2.231-0.997 3.461 0 3.584 2.916 6.5 6.5 6.5s6.5-2.916 6.5-6.5c0-1.23-0.345-2.426-0.997-3.461-0.635-1.008-1.533-1.822-2.596-2.354l0.672-1.341c1.308 0.655 2.412 1.656 3.193 2.895 0.803 1.274 1.228 2.748 1.228 4.261 0 2.137-0.832 4.146-2.343 5.657s-3.52 2.343-5.657 2.343z"></path>
              </svg>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="section__title page__title">Settings</div>
            {isAuthenticated ? (
              <>
                <div className="setting__content">
                  <div className="settings__sub--title">
                    Your Subscription plan
                  </div>
                  <div className="settings__text">
                    {isSubscribed ? "Premium" : "Basic"}
                  </div>
                  {!isSubscribed && (
                    <button
                      onClick={() => {
                        router.push("/choose-plan");
                      }}
                      className="btn settings__upgrade--btn"
                    >
                      Upgrade to Premium
                    </button>
                  )}
                </div>
                <div className="setting__content">
                  <div className="settings__sub--title">Email</div>
                  <div className="settings__text">{userEmail}</div>
                </div>
              </>
            ) : (
              <div className="settings__login--wrapper">
                <img
                  alt="login"
                  srcSet="/assets/login.png 1x, ./assets/login.png 2x"
                  src="/assets/login.png"
                  width="1033"
                  height="712"
                  decoding="async"
                  data-nimg="1"
                  loading="lazy"
                  style={{ color: "transparent" }}
                />
                <div className="settings__login--text">
                  Log in to your account to see your details.
                </div>
                <button
                  onClick={() => dispatch(openModal())}
                  className="btn settings__login--btn"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
