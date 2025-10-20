import { Router } from "express";
import { createQuotation, listQuotations, getQuotation } from "../controllers/quotationController";

const router = Router();

router.post("/", createQuotation);
router.get("/", listQuotations);
router.get("/:id", getQuotation);

export default router;