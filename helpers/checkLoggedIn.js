/** @format */

import admin from "../config/firebase-config.js";

const checkLoggedIn = async (sessionCookie) => {
  let response = {
    status: false,
    error: "",
    email: "",
  };

  if (sessionCookie != undefined) {
    await admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(async (userData) => {
        response.status = true;
        response.email = userData.email;
      })
      .catch((error) => {
        response.error = error;
      });
  }

  return response;
};

export default checkLoggedIn;
