import React from "react";
import NavbarBasic from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout() {
  return (
    <>
      {/* Navigation */}
      <NavbarBasic />
      
      {/* Main Content */}
      <Outlet />
      
      {/* Footer */}
      <Footer />
      
      {/* Toast Notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
