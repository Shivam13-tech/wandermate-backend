import express from "express";
import { getGuideTour } from "../Controllers/userController";

const router = express.Router();

router.route("/getalltour").get(getGuideTour);

export default router;
