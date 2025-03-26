import { Router } from "express";
import { createTripData, getAllTrips, getLatestTrips, getTripById, getTripCodeById, getTripsForUser } from "../controllers/tripController";

const router = Router();

router.post('/createTrip', createTripData);
router.get('/getTripCodeById/:trip_id', getTripCodeById);
router.get('/getAllTrips/:user_id', getAllTrips);
router.get('/getLatestTrips/:user_id', getLatestTrips);
router.get('/getTripsFromFriends/:user_id', getTripsForUser);
router.get('/getTripById/:trip_id', getTripById)

export default router;