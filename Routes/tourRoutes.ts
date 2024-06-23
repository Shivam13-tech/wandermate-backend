import express from "express";
import {
  uploadimage,
  createTour,
  getGuideTour,
  deleteTour,
} from "../Controllers/tourController";
import { protectRoute } from "../Controllers/authController";

const router = express.Router();

router.route("/addtour").post(protectRoute, uploadimage, createTour);
router.route("/gettour").get(protectRoute, getGuideTour);
router.route("/deletetour/:id").delete(protectRoute, deleteTour);

export default router;
