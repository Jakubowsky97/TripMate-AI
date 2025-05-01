import { Router } from "express";
import { createTripData, getAllTrips, getTripById, getTripCodeById, getTripsForUser, getUserProfile, joinTrip } from "../controllers/tripController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post('/createTrip', authenticate, createTripData);
router.get('/getTripCodeById/:trip_id', authenticate, getTripCodeById);
router.get('/getAllTrips/', authenticate, getAllTrips);
router.get('/getTripsFromFriends', authenticate, getTripsForUser);
router.get('/getTripById/:trip_id', authenticate, getTripById)
router.post('/joinTrip', authenticate, joinTrip); 
router.get('/getUserData', authenticate, getUserProfile)

export default router;