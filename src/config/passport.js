const dotenv = require("dotenv");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const path = require("path");

const User = require("../models/User");

dotenv.config({ path: path.join(__dirname, "../../.env") });

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
opts.passReqToCallback = true;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (req, jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            req.user = user;
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((error) => {
          console.log(error);
        });
    })
  );
};
