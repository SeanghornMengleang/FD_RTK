import {
  GithubAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase-config";
import { tr } from "zod/v4/locales";
import { flattenError } from "zod";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../../features/auth/authSlide";

export const useLoginWithGithub = () => {
  const [error, setError] = useState(false);
  const [pending, setIsPending] = useState(false);
  //data (user credential)
  const [user, setUser] = useState(null);
  const provider = new GithubAuthProvider();

  // calling signup slice
  const [signupRequest, { data }] = useRegisterMutation();

  // calling login slice
  const [loginRequest, { data: LoginData }] = useLoginMutation();

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

  const loginWithGithub = async () => {
    setIsPending(true);
    try {
      const res = await signInWithPopup(auth, provider);
      if (!res) {
        throw new Error("login unsuccessfully");
      }
      const user = res.user;
      console.log("Github Info: ", user);

      //implement signup with api
      try {
        await signupRequest({
          username: user?.displayName.substring(0, 4),
          phoneNumber: user?.phoneNumber,
          address: {
            addressLine1: "",
            addressLine2: "",
            road: "",
            linkAddress: "",
          },
          email: user?.email,
          password: `${user?.displayName.substring(0, 4)}${
            import.meta.env.VITE_SECRET_KEY
          }`,
          confirmPassword: `${user?.displayName.substring(0, 4)}${
            import.meta.env.VITE_SECRET_KEY
          }`,
          profile: user?.photoURL,
        }).unwrap();
        if (!data) {
          console.log("SignUp Failed");
        }
        const res = data.json();
        console.log("Response: ", res);
        console.log("=====> ", signUpError.code.status);
      } catch (error) {
        console.log("======> error signup : ", error);
        const checkAuth = error.status;

        if (checkAuth == 400 || checkAuth == 200) {
          loginRequest({
            email: user?.email,
            password: `${user?.displayName.substring(0, 4)}${
              import.meta.env.VITE_SECRET_KEY
            }`,
          }).unwrap();

          if (!data) {
            console.log("Login isn't success");
          }
          // const response =await  data.json();
          console.log("======>user data after login", data.accessToken);
        }
      }

      setIsPending(false);
    } catch (error) {
      setError(error);
      console.log(error.message);
      setIsPending(false);
    }
  };

  //logout features
  const GithubLogout = async () => {
    setIsPending(false);
    setError(null);
    try {
      await signOut(auth);
      setIsPending(true);
      console.log("Logout successfully!");
    } catch (error) {
      setError(error);
      console.log(error.message);
      setIsPending(false);
    }
  };

  return { GithubLogout, loginWithGithub, pending, error, user };
};
