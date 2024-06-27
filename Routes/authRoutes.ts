import express from "express";
import { signup, getUserById } from "../Controllers/authController";
import { login } from "../Controllers/authController";

const router = express.Router();

router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/getuser/:id").get(getUserById);

export default router;
