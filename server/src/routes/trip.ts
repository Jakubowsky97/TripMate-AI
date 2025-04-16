import { Router } from "express";
import { createTripData, getAllTrips, getTripById, getTripCodeById, getTripsForUser } from "../controllers/tripController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post('/createTrip', authenticate, createTripData);
router.get('/getTripCodeById/:trip_id', authenticate, getTripCodeById);
router.get('/getAllTrips/', authenticate, getAllTrips);
router.get('/getTripsFromFriends', authenticate, getTripsForUser);
router.get('/getTripById/:trip_id', authenticate, getTripById)

export default router;