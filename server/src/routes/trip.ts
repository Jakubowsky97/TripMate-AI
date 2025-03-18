import { Router } from "express";
import { createTripData, getAllTrips, getLatestTrips, getTripCodeById } from "../controllers/tripController";

const router = Router();

router.post('/createTrip', createTripData);
router.get('/getTripCodeById/:trip_id', getTripCodeById);
router.get('/getAllTrips/:user_id', getAllTrips);
router.get('/getLatestTrips/:user_id', getLatestTrips);

export default router;