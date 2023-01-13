import express from "express";
import { dashboard } from "../controllers/dashboard.js";
const router = express.Router();

import {home,homePost} from "../controllers/home.js";
import {login,postLogin,logOut} from "../controllers/login.js"
import { authMiddleware } from "../middleware/authMidleware.js";

router.get("/", home);
router.post("/",homePost)
router.get("/login",login)
router.post("/login",postLogin)
router.get("/dashboard",authMiddleware,dashboard)
router.get("/logout",logOut)




export default router;
