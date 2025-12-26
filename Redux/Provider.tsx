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
    // This listener handles both Auth state and firestore sync
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Update the general auth state in Redux
      //  If user is logged in, listen to their firestore documemnt
      if (user) {
        const userData = { uid: user.uid, email: user.email };
        store.dispatch(setUser(userData));

        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const isSubscribed = userData.isSubscribed === true;
            // Update the subscription status globally in Redux
            store.dispatch(setSubscriptionsStatus(isSubscribed));
          } else {
            // Document dosen't exist yet
            store.dispatch(setSubscriptionsStatus(false));
          }
        });
        // Clean up function for when user logs out
        return () => unsubscribeFirestore();
      } else {
        //  If user logs out, reset subscription status
        store.dispatch(setUser(null));
        store.dispatch(setSubscriptionsStatus(false));
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
