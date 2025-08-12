import React from "react";
import { useLoginWithGoogle } from "./UseLoginFirebase";
import { useLoginWithGitHub } from "../../social-auth/GithubAuthComponent";

export default function LoginWithSocialMedia() {
  const {
    googleLogin,
    lagout: googleLogout,
    isPending: googlePending,
    user: googleUser,
  } = useLoginWithGoogle();
  const {
    login: githubLogin,
    logout: githubLogout,
    isPending: githubPending,
    user: githubUser,
  } = useLoginWithGitHub();

  const currentUser = googleUser;
  const isPending = googlePending;
  const getProvider = () => {
    if (googleUser) return "Google";
    return "";
  };
  const handleLogout = () => {
    if (githubUser) {
      githubLogout();
    }
    //  else if (facebookUser) {
    //  facebookLogout();
    else if (googleUser) {
      googleLogout();
    }
  };
  console.log("the currentUser:", currentUser?.photoURL);
  return (
    <div>
      <h1>OAuth Login Demo</h1>

      {currentUser ? (
        // User is logged in
        <div>
          <h2>Welcome, {currentUser.displayName || currentUser.email}!</h2>
          <p>You are logged in with {getProvider()}</p>
          <div style={{ margin: "10px 0" }}>
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: "2px solid #ccc",
                }}
                onError={(e) => {
                  console.log("Image failed to load:", currentUser.photoURL);
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "#007bff",
                color: "white",
                display: currentUser.photoURL ? "none" : "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {(currentUser.displayName || currentUser.email || "U")
                .charAt(0)
                .toUpperCase()}
            </div>
          </div>
          <button className="btn" onClick={handleLogout}>
            {isPending ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      ) : (
        // User is not logged in
        <div>
          <h2>Login with Google</h2>
          <div className="App">
            <button className="btn" onClick={googleLogin}>
              {googlePending ? "Loading..." : "Login With Google"}
            </button>
          </div>
          <h2>Login with GitHub</h2>
          <div className="App">
            <button className="btn" onClick={githubLogin}>
              {githubPending ? "Loading..." : "Login With Github"}
            </button>
          </div>
          {/* <h2>Login with Facebook</h2>
 <div className="App">
 <button onClick={facebookLogin}>
 {facebookPending ? "Loading..." : "Login With Facebook"}
 </button>
 </div> */}
        </div>
      )}
    </div>
  );
}
// export default App
