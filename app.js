require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const PgSession = require("connect-pg-simple")(session);
const pool = require("./db/pool");
const indexRouter = require("./routes/indexRouter");
const authenticationRouter = require("./routes/authenticationRouter");
const profileRouter = require("./routes/profileRouter");
const memberShipRouter = require("./routes/memberShipRouter");
const postsRouter = require("./routes/postsRouter");

require("./config/passportConfig");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PgSession({
      pool,
      createTableIfMissing: true,
    }),
  })
);
app.use(flash());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use((req, res, next) => {
  res.locals.currentPath = req.path;

  next();
});

app.use("/", indexRouter);
app.use("/", authenticationRouter);
app.use("/", memberShipRouter);
app.use("/profile", profileRouter);
app.use("/post", postsRouter);

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).send(err);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express app listening on port: ${port}!`);
});
