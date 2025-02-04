import express from "express";
import { engine } from "express-handlebars";
import admin from "./config/firebase-config.js";
import checkLoggedIn from "./helpers/checkLoggedIn.js";
import cookieParser from "cookie-parser";
//import ensureAuthenticated from "./middleware/auth.js";
import connectDB from "./config/mongodb.js";
import urlRouter from "./routes/url.js";
import authRouter from "./routes/auth.js";
import indexRouter from "./routes/index.js";
connectDB();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(express.static("public"));

app.use(async (req, res, next) => {
  res.locals.logged_in = await checkLoggedIn(req.cookies.session);
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
