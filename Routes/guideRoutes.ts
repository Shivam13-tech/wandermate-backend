import express from "express";
import { createGuide, loginGuide } from "../Controllers/guideController";

const router = express.Router();

router.route("/createguide").post(createGuide);
router.route("/loginguide").post(loginGuide);

export default router;
