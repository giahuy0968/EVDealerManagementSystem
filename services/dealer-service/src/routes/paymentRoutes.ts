import { Router } from "express";
import { createPayment, listPayments, getPayment } from "../controllers/paymentController";

const router = Router();

router.post("/", createPayment);
router.get("/", listPayments);
router.get("/:id", getPayment);

export default router;