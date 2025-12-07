"use client";

import Searchbar from "@/components/Searchbar";
import Sidebar from "@/components/Sidebar";
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

  const dispatch = useDispatch();

  return (
    <div className="wrapper">
      <Searchbar />
      <Sidebar />
      <div className="container">
        <div className="row">
          <div className="section__title page__title">Settings</div>
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
        </div>
      </div>
    </div>
  );
};

export default Settings;
