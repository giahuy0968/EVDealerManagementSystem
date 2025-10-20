import { Router } from "express";
import { createContract, listContracts, getContract } from "../controllers/contractController";

const router = Router();

router.post("/", createContract);
router.get("/", listContracts);
router.get("/:id", getContract);

export default router;