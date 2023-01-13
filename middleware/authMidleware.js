
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

dotenv.config();
const { APP_HOSTNAME, APP_PORT, NODE_ENV,APP_SECRET } = process.env;

export const authMiddleware = (req, res, next) => {
   
    try {
      const token = jwt.verify(req.session.token, APP_SECRET);
     if(token){
      req.flash("success", "Vous êtes bien authentifié");

        return res.render("dashboard",{successMessage:req.flash('success')});
     }   
      next();
    }
    catch (err) {
      return res.render("error");

}
}