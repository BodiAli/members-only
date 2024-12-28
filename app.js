require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const PgSession = require("connect-pg-simple")(session);
const pool = require("./db/pool");
const indexRouter = require("./routes/indexRouter");
const authenticationRouter = require("./routes/authenticationRouter");

require("./config/passportConfig");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PgSession({
      pool,
      createTableIfMissing: true,
    }),
    cookie: { maxAge: 100000 },
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);
app.use("/", authenticationRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express app listening on port: ${port}!`);
});

// TODO: Implement authentication using local and google auth strategies.
