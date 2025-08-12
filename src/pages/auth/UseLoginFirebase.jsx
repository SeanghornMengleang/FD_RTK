import { useEffect, useState } from "react";
import{
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
}from "firebase/auth";
import {auth} from "../../firebase/firebase-config";


export const useLoginWithGoogle = () => {
 const [error, setError] = useState(false);
 const [isPending, setIsPending] = useState(false);
 const [user, setUser] = useState(null);
 const provider = new GoogleAuthProvider();
 // Listen for authentication state changes
 useEffect(() => {
 const unsubscribe = onAuthStateChanged(auth, (user) => {
 if (user) {
 setUser(user);
 } else {
 setUser(null);
 }
 });
 return () => unsubscribe(); // Cleanup subscription
 }, []);
 const googleLogin = async () => {
 setError(null);
 setIsPending(true);
 try {
 const res = await signInWithPopup(auth, provider);
 if (!res) {
 throw new Error("Could not complete Google login");
 }
 const user = res.user;
 console.log("Google user:", user);
 setIsPending(false);
 } catch (error) {
 console.log(error);
 setError(error.message);
 setIsPending(false);
 }}
 const logout = async () => {
 setError(null);
 setIsPending(true);
 try {
 await signOut(auth);
 console.log("User signed out successfully");
 setIsPending(false);
 } catch (error) {
 console.log(error);
 setError(error.message);
 setIsPending(false);
 }
 };
 return { googleLogin, logout, error, isPending, user };
};