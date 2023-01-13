
import { User } from "../Models/User.js";
import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

export function dashboard(req, res) {
    res.render("dashboard",{successMessage:req.flash('success')});

}
