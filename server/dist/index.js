"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./env");
const node_http_1 = require("node:http");
const auth_1 = __importDefault(require("./routes/auth"));
const profile_1 = __importDefault(require("./routes/profile"));
const trip_1 = __importDefault(require("./routes/trip"));
const socket_io_1 = require("socket.io");
const chat_1 = __importDefault(require("./routes/chat"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const corsOptions = {
    origin: `${env_1.APP_URL}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus: 200,
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/profile', profile_1.default);
app.use('/api/trip', trip_1.default);
app.use('/api/chat', chat_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: `${env_1.APP_URL}`,
        methods: ['GET', 'POST']
    }
});
const trips = {}; // Stores markers for each trip
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('joinTrip', (tripId) => {
        socket.join(tripId);
        console.log(`${socket.id} joined trip ${tripId}`);
        // Send existing markers for the trip if they exist
        if (trips[tripId]) {
            socket.emit('existingMarkers', trips[tripId]);
        }
        else {
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
        }
        else {
            console.error('Nieprawidłowe dane markera:', marker);
        }
    });
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
server.listen(env_1.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env_1.PORT}`);
});
