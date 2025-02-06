import "dotenv/config";

import express from "express";
import { engine } from "express-handlebars";
import checkLoggedIn from "./helpers/checkLoggedIn.js";
import cookieParser from "cookie-parser";
//import ensureAuthenticated from "./middleware/auth.js";
import connectDB from "./config/mongodb.js";
import urlRouter from "./routes/url.js";
import authRouter from "./routes/auth.js";
import indexRouter from "./routes/index.js";
import csrf from "csurf";
// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

// Static files
app.use(express.static("public"));

// CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.use(async (req, res, next) => {
  // Set CSRF token in cookies
  res.cookie("XSRF-TOKEN", req.csrfToken());

  // Check if user is logged in
  res.locals.logged_in = await checkLoggedIn(req.cookies.session);

  // Set Firebase client keys
  res.locals.firebaseClientKeys = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };
  next();
});

// Add index routes
app.use("/", indexRouter);

// Add auth routes
app.use("/auth", authRouter);

// Add URL routes
app.use("/url", urlRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
