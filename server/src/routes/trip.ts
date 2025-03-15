import { Router } from "express";
import { createTripData } from "../controllers/tripController";

const router = Router();

router.post('/createTrip', createTripData);

export default router;