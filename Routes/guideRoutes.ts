import express from "express";
import { createGuide } from "../Controllers/guideController";

const router = express.Router();

router.route("/createguide").post(createGuide);

export default router;
