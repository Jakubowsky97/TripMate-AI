import express from "express";
import cors from "cors";
import { APP_URL, PORT } from "./env";
import { createServer } from 'node:http';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import tripRoutes from './routes/trip';
import { Server } from "socket.io";
import chatRoutes from "./routes/chat";
import cookieParser from 'cookie-parser';

const app = express();
const server = createServer(app);

const corsOptions = {
  origin: `${APP_URL}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200,
  credentials: true,  
};

app.use(cors(corsOptions));
app.use(cookieParser()); 
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/chat', chatRoutes);

const io = new Server(server, {
  cors: {
    origin: `${APP_URL}`,
    methods: ['GET', 'POST']
  }
});

interface Marker {
  lat: number;
  lng: number;
}

interface Trips {
  [key: string]: Marker[];
}

const trips: Trips = {}; // Stores markers for each trip

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinTrip', (tripId) => {
    socket.join(tripId);
    console.log(`${socket.id} joined trip ${tripId}`);

    // Send existing markers for the trip if they exist
    if (trips[tripId]) {
      socket.emit('existingMarkers', trips[tripId]);
    } else {
      trips[tripId] = []; // Initialize if empty
    }
  });

  socket.on('addMarker', ({ tripId, marker }) => {
    if (marker && typeof marker.lng === 'number' && typeof marker.lat === 'number') {
      if (!trips[tripId]) {
        trips[tripId] = []; // Upewnij się, że tripId istnieje
      }
  
      trips[tripId].push(marker); // Zapisz marker
  
      // Powiadom wszystkich użytkowników w tej samej podróży o nowym markerze
      io.to(tripId).emit('newMarker', marker);
  
    } else {
      console.error('Nieprawidłowe dane markera:', marker);
    }
  });
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
