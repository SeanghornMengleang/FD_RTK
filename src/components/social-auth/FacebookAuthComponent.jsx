import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth"; 
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase-config";
import { tr } from "zod/v4/locales";
import { flattenError } from "zod";

export const useLoginWithFacebook = () => {
  const [error, setError] = useState(false);
  const [pending, setIsPending] = useState(false);
  //data (user credential)
  const [user, setUser] = useState(null);
  const provider = new FacebookAuthProvider();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const FacebookLogin = async () => {
    setIsPending(true);
    try {
      const res = signInWithPopup(auth, provider);
      if (!res) {
        throw new Error("Failed to login");
      }
      const user = res.user;
      console.log("Facebook Info : ", user);
      setIsPending(false);
    } catch (error) {
      setError(error);
      console.log(error.message);
      setIsPending(false);
    }
  };
  const FacebookLogout = async () => {
    setIsPending(false);
    setError(null);
    try {
      await signOut(auth);
      console.log("Sign out successfully!");
      setIsPending(false);
    } catch (error) {
      setError(error);
      setIsPending(false);

      console.log(error.message);
    }
  };

  return { FacebookLogout, FacebookLogin, pending, error, user };
};
