import {Router} from 'express'
import {register,login,current,logout } from '../controllers/sessions.controller.js'
import passport from 'passport'

const router = Router()

router.post(
  "/register",
  (req, res, next) => {
    passport.authenticate("register", { session: false }, (error, user, info) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        return res.status(info?.statusCode || 400).json({
          status: "error",
          message: info?.message || "Error en el registro"
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  register
);

router.post('/login',
    (req,res,next)=>{
        passport.authenticate('login', {session:false},(error,user,info)=>{
            if (error){
                return next(error)
            }
            if (!user) {
              return res.status(401).json({
                status: "error",
                message: "Credenciales inválidas"
              });
            }
            req.user=user
            next()
        })(req,res,next)
    },
    login
)

router.get('/current',
  (req,res,next)=>{
    passport.authenticate(
      'current',{session: false},
      (error, user)=>{
        if(error){
          return next(error)
        }
        if(!user){
          return res.status(401).json({
            status:'error',
            message: 'No autenticado'
          })
        }
        req.user=user
        next()
      }
    )(req,res,next)
  }, current
)

router.post('/logout',logout)

export default router