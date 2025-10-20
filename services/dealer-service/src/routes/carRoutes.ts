import { Router } from "express";
import { listCars, getCar, createCar } from "../controllers/carController";

const router = Router();

router.get("/", listCars);
router.get("/:id", getCar);
router.post("/", createCar);

export default router;