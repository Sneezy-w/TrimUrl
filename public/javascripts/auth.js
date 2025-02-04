import { firebaseAuth } from "./firebase-config.js";

class AuthManager {
  constructor() {
    console.log("AuthManager constructor", firebaseAuth);
    this.auth = firebaseAuth;
    //this.setupAuthStateListener();
    //this.setupFormListeners();
  }

  // setupAuthStateListener() {
  //   this.auth.onAuthStateChanged((user) => {
  //     console.log("AuthStateChanged", user);
  //     const loginNav = document.getElementById("loginNav");
  //     const signupNav = document.getElementById("signupNav");
  //     const logoutNav = document.getElementById("logoutNav");

  //     if (user) {
  //       loginNav.classList.add("d-none");
  //       signupNav.classList.add("d-none");
  //       logoutNav.classList.remove("d-none");
  //     } else {
  //       loginNav.classList.remove("d-none");
  //       signupNav.classList.remove("d-none");
  //       logoutNav.classList.add("d-none");
  //     }
  //   });
  // }

  async logout() {
    try {
      await this.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      alert(error.message);
    }
  }
}

// Initialize Auth Manager
const authManager = new AuthManager();

// Global logout function
function logout() {
  authManager.logout();
}

async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await firebaseAuth.signInWithPopup(provider);
    const idToken = await result.user.getIdToken();

    await fetch("/auth/sessionLogin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //"CSRF-Token": Cookies.get("XSRF-TOKEN"),
      },
      body: JSON.stringify({ idToken }),
    });

    await firebaseAuth.signOut();
    window.location.assign("/?message=loginSuccess");
  } catch (error) {
    console.error("Error during Google sign in:", error);
    alert(error.message);
  }
}

// Make signInWithGoogle available globally
window.signInWithGoogle = signInWithGoogle;
