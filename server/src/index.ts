import express from "express";
import cors from "cors";
import { PORT } from "./env";
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';

const app = express();

app.use(cors({ origin: "http://localhost:3000" }  ));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
