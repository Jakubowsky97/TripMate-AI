import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./config";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


app.get("/profiles", async (req, res) => {
  try {
      const { data, error } = await supabase
          .from("profiles") 
          .select("*"); 

      if (error) {
          throw error;
      }
      console.log(data);
      res.send(data);
  } catch (error) {
      console.error("Data fetch error:", error);
      res.status(500).json({ error: "Data fetch error." });
  }
});

// Sample Route
app.get("/", (req, res) => {
  res.send("TripMate AI Backend is running ");

});

app.listen(PORT, () => {
  console.log(`🚀 Serwer działa na http://localhost:${PORT}`);
});


