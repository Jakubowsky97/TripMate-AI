import express from "express";
import cors from "cors";
import { PORT } from "./env";
import { createServer } from 'node:http';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

app.use(cors({ origin: "http://localhost:3000" }  ));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinTrip', (tripId) => {
    socket.join(tripId);
    console.log(`${socket.id} joined trip ${tripId}`);
  });

  socket.on('addMarker', ({ tripId, marker }) => {
    if (marker && typeof marker.lng === 'number' && typeof marker.lat === 'number') {
      io.to(tripId).emit('newMarker', marker);
      console.log(marker); // Log the received marker
    } else {
      console.error('Invalid marker data:', marker);
    }
  });
  

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
