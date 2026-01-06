"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase.js";
import { setSubscriptionsStatus, setUser } from "./authSlice";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { app } from "../firebase.js";

const db = getFirestore(app);

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // if (!user) return;
    let unsubscribeFirestore: (() => void) | null = null;
    // This listener handles both Auth state and firestore sync
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Update the general auth state in Redux
      //  If user is logged in, listen to their firestore documemnt
      if (user) {
        const userData = { uid: user.uid, email: user.email };
        store.dispatch(setUser(userData));
        // store.dispatch(setUser({ uid: user.uid, email: user.email }));

        const userDocRef = doc(db, "users", user.uid);
        // Start the listener and save the function to our variable
        unsubscribeFirestore = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              // const isSubscribed = userData.isSubscribed === true;
              // Update the subscription status globally in Redux
              store.dispatch(
                setSubscriptionsStatus(data.isSubscribed === true)
              );
            } else {
              store.dispatch(setSubscriptionsStatus(false));
            }
          },
          (error) => {
            if (error.code === "permission-denied") {
              console.warn("Firestore listener detached safely.");
            }
          }
        );
      } else {
        if (unsubscribeFirestore) {
          unsubscribeFirestore();
          unsubscribeFirestore = null;
        }
        store.dispatch(setUser(null));
        store.dispatch(setSubscriptionsStatus(false));
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
