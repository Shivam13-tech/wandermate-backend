import express from "express";
import {
  uploadimage,
  createTour,
  getGuideTour,
  deleteTour,
} from "../Controllers/tourController";
import { protectGuideRoute } from "../Controllers/authController";

const router = express.Router();

router.route("/addtour").post(protectGuideRoute, uploadimage, createTour);
router.route("/gettour").get(protectGuideRoute, getGuideTour);
router.route("/deletetour/:id").delete(protectGuideRoute, deleteTour);

export default router;
