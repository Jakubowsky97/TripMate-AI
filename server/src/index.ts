import express from "express";
import cors from "cors";
import { PORT } from "./env";
import authRoutes from './routes/auth';

const app = express();

app.use(cors({ origin: "http://localhost:3000" }  ));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
