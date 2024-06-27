import express from "express";
import { getGuideTour, getTourById } from "../Controllers/userController";

const router = express.Router();

router.route("/getalltour").get(getGuideTour);
router.route("/gettour/:id").get(getTourById);

export default router;
