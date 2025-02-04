import express from "express";
import { engine } from "express-handlebars";
import admin from "./config/firebase-config.js";
import checkLoggedIn from "./helpers/checkLoggedIn.js";
import cookieParser from "cookie-parser";
//import ensureAuthenticated from "./middleware/auth.js";
import connectDB from "./config/mongodb.js";

connectDB();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",
  engine({
    extname: "hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static("public"));

app.use(async (req, res, next) => {
  res.locals.logged_in = await checkLoggedIn(req.cookies.session);
  next();
});

app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

app.post("/auth/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 7 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/auth/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
