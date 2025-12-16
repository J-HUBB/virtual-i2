"use client";

import Searchbar from "@/components/Searchbar";
import Sidebar from "@/components/Sidebar";
import { firebaseConfig } from "@/firebase";
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
  // const accountSummary = (
  //   <div>
  //     <div className="text-slate-500 mb-1">Signed in as {userName}</div>
  //     <div className="text-slate-300 text-xl">{email}</div>
  //   </div>
  // );

  // const statusPanel = isPremium ? <PremiumPanel /> : <StandardPanel />;
  // const memberButton = isPremium ? managePortalButton : upgradeToPremiumButton;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const email = auth.currentUser?.email;
  const router = useRouter();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const isSubscribed = useSelector(
    (state: RootState) => state.auth.isSubscribed
  );

  const dispatch = useDispatch();

  return (
    <div className="wrapper">
      <Searchbar />
      <Sidebar />
      <div className="container">
        <div className="row">
          <div className="section__title page__title">Settings</div>
          {isAuthenticated && !isSubscribed ? (
            <>
              <div className="setting__content">
                <div className="settings__sub--title">
                  Your Subscription plan
                </div>
                <div className="settings__text">Basic</div>
                <button
                  onClick={() => {
                    router.push("/choose-plan");
                  }}
                  className="btn settings__upgrade--btn"
                >
                  Upgrade to Premium
                </button>
              </div>
              <div className="setting__content">
                <div className="settings__sub--title">Email</div>
                <div className="settings__text">{email}</div>
              </div>
            </>
          ) : (
            <div className="settings__login--wrapper">
              <img
                alt="login"
                srcSet="./assets/login.png 1x, ./assets/login.png 2x"
                src="./assets/login.png"
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
      </div>
    </div>
  );
};

export default Settings;
