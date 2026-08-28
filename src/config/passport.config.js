import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmail, saveUser } from "../repositories/users.repository.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import {Strategy as CustomStrategy} from "passport-custom";
import {verifyToken} from "../utils/jwt.js";


passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const { first_name, last_name } = req.body;
        if (!first_name || !last_name || !email || !password) {
          return done(null, false, {
            message: "Faltan campos obligatorios",
          });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const normalizedEmail = email.trim().toLowerCase();

        if (!emailRegex.test(normalizedEmail)) {
          return done(null, false, {
            message: "Email inválido",
          });
        }
        if (password.length < 8) {
          return done(null, false, {
            message: "La contraseña debe tener al menos 8 caracteres",
          });
        }
        const existingUser = await getUserByEmail(normalizedEmail);
        if (existingUser) {
          return done(null, false, {
            message: "El email ya está registrado",
            statusCode: 409,
          });
        }
        const hashedPassword = await createHash(password);
        const user = await saveUser({
          first_name,
          last_name,
          email: normalizedEmail,
          password: hashedPassword,
        });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await getUserByEmail(normalizedEmail);
        if (!user) {
          return done(null, false, {
            message: "Credenciales inválidas",
          });
        }
        const validPassword = await isValidPassword(password, user.password);
        if (!validPassword) {
          return done(null, false, {
            message: "Credenciales inválidas",
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  'current', new CustomStrategy(async(req,done)=>{
    try{
      const token=req.cookies?.currentUser
      if (!token){
        return done(null,false)
      }
      const decoded= verifyToken(token)
      return done(null,decoded)
    }catch(error){
      return done(null,false)
    }
  })
)

export default passport;
