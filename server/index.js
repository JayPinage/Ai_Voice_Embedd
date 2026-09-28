import express from "express";
import dotenv from "dotenv";
import connectDB from "./Config/ConnectDB.js";
import dns from "node:dns";
import authRouter from "./Routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./Routes/user.route.js";
import assistantRouter from "./Routes/assistant.route.js";
import billingRouter from "./Routes/billing.route.js";

dotenv.config();

dns.setServers(["1.1.1.1", "1.0.0.1"]);

const app = express();

const corsOptions = {
    origin: "https://embeddai.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

// IMPORTANT: CORS before routes
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json("Hello from server");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/billing", billingRouter);
app.use("/api/assistant", assistantRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server started on ${PORT}`);
    connectDB();
});
