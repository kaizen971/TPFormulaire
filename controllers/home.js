import { User } from "../Models/User.js";
import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();
const { APP_HOSTNAME, APP_PORT, NODE_ENV,APP_SECRET } = process.env;
export function home(req, res) {
  res.render("home");
}
export function homePost(req,res){
  const error = []
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const password_confirm = req.body.password_confirm;
  const email = req.body.email;
  if (!lastName || !firstName || !email || !password) {
     error.push({title:"Champs vide", description:"Vous avez un champs vide"});
  }
  if (!/^[a-zA-Z ]+$/.test(lastName) || !/^[a-zA-Z ]+$/.test(firstName)) {
     error.push({title:"Nom et prénom non valide", description:"Le noms et prénom n'est pas valide"});
  }
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
     error.push({title:"L'email n'est pas valide", description:"L'email n'est pas valide"});
  }
  if (password.length < 8) {
     error.push({title:"Mot de passe non valide", description:"Votre mot de passe doit faire 8 caractères"});
  }
  if(password != password_confirm ){
     error.push({title:"Mot de passe non valide", description:"Votre mot de passe doit être identique"});
  }

  if(error.length > 0){
   return res.render("home",{errors:error});
  }

  User.findOne({email:email}, (err, user) => {
    if (err) throw err;
    if (user) {
        res.render("home",{errors:[{title:"Utilisateur déjà utilisé",description:"Ce nom d\'utilisateur est déjà utilisé"}]});
    } else {
        // Hash du mot de passe
            bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) throw err;
            // Enregistrement de l'utilisateur en base de données
            const newUser = {
              firstName:firstName,
              lastName :lastName,
              password:hashedPassword,
              email:email
            };
            User.insertMany(newUser, (err, result) => {
                if (err) throw err;
                req.flash("success", "Formulaire soumis avec succès");
                res.redirect('/login');
            });

            req.session.token = jwt.sign(
              {firstName:firstName, lastName:lastName, email: 'alan@alan.fr' },
              APP_SECRET,
              { expiresIn: '24h' }
            );

        });
    }
});

}