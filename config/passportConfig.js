const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const pool = require("../db/pool");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const {
          rows: [existingUser],
        } = await pool.query("SELECT * FROM users WHERE google_id = $1;", [profile.id]);

        if (existingUser) {
          return done(null, existingUser);
        }

        const {
          rows: [newUser],
        } = await pool.query(
          "INSERT INTO users (first_name, last_name, username, google_id) VALUES ($1, $2, $3, $4) RETURNING *;",
          [profile.name.givenName, profile.name.familyName, profile.emails[0].value, profile.id]
        );
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const {
        rows: [user],
      } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

      if (!user) {
        return done(null, false, { message: "Incorrect username or password" });
      }

      if (user.google_id) {
        return done(null, false, { message: "Please log in with google" });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: "Incorrect username or password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const {
      rows: [user],
    } = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if (!user) {
      return done(null, null);
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});
