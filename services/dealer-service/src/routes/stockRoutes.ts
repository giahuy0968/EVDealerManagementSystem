import { Router } from "express";
import { createStockRequest, approveStockRequest, listStockRequests, getStockRequest } from "../controllers/stockController";

const router = Router();

router.post("/", createStockRequest);
router.post("/:id/approve", approveStockRequest);
router.get("/", listStockRequests);
router.get("/:id", getStockRequest);

export default router;