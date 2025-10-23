import express from "express";
import {isAuthenticatedUser} from "../backend/middlewares/auth.js"
import { stripWebHook, stripeCheckoutSession } from "../controllers/paymentController.js";

const router = express.Router();

router.route("/payment/checkout_session").post(isAuthenticatedUser, stripeCheckoutSession);
router.route("/payment/webhook").post(stripWebHook);

export default router;