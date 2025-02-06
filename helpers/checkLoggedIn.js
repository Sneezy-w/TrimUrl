/** @format */

import admin from "../config/firebase-config.js";

const checkLoggedIn = async (sessionCookie) => {
  let response = {
    status: false,
    error: "",
    email: "",
    uid: "",
  };

  if (sessionCookie != undefined) {
    await admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(async (userData) => {
        //console.log(userData);
        response.status = true;
        response.email = userData.email;
        response.uid = userData.uid;
      })
      .catch((error) => {
        response.error = error;
      });
  }

  return response;
};

export default checkLoggedIn;
