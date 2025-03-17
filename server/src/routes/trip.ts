import { Router } from "express";
import { createTripData, getTripCodeById } from "../controllers/tripController";

const router = Router();

router.post('/createTrip', createTripData);
router.get('/getTripCodeById/:trip_id', getTripCodeById);

export default router;