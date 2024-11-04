import express from "express";
import {
    currentUser,
    login,
    logout,
    register,
} from "../controllers/userControllers";
import { isLoggedIn } from "../middlewares/isLoggedIn";

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").post(isLoggedIn, logout);
router.route("/currentUser").get(isLoggedIn, currentUser);

export default router;
