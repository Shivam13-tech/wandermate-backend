import express from "express";
import { createCheckout } from "../Controllers/paymentController";

const router = express.Router();

router.route("/createcheckout").post(createCheckout);

export default router;
