
import { User } from "../Models/User.js";
import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

export function login(req, res) {
    res.render("login",{successMessage:req.flash('success')});
}
export function logOut(req, res) {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    res.redirect("/");
  });
}
dotenv.config();
const { APP_HOSTNAME, APP_PORT, NODE_ENV,APP_SECRET } = process.env;
export function postLogin(req, res){
    const error = []

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
        error.push({title:"L'email n'est pas valide", description:"L'email n'est pas valide"});
     }
     if(error.length > 0 ){
        return res.render("login",{errors:error});
    }

    User.findOne({ email: req.body.email }, (err, user) => {
      if (err){
        return res.status(500).send('Error on the server.');
      } 
      if (!user){
        error.push({title:"Email introuvable",description: "Votre email est introuvable"})
      } 
      if(error.length > 0 ){
        return res.render("login",{errors:error});
      }
      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid){
        error.push({title:"Mot de passe invalide",description: "Votre mot de passe est invalide"})
      } 
      if(error.length > 0 ){
        return res.render("login",{errors:error});
      }
       req.session.token = jwt.sign({ email: req.body.email }, APP_SECRET, {
        expiresIn: 86400 
      });
      res.redirect("/dashboard");
    });
  };