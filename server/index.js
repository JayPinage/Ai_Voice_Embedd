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


// ===============================
// CORS
// ===============================

const allowedOrigins = [
    "https://embeddai.onrender.com",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
];

const corsOptions = {
    origin: function (origin, callback) {

        // Allow requests without Origin
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log("Blocked by CORS:", origin);

        return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS"
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ]
};


// CORS MUST come before routes
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());


// ===============================
// ROUTES
// ===============================

app.get("/", (req, res) => {
    res.json("Hello from server");
});

app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);

app.use("/api/billing", billingRouter);

app.use("/api/assistant", assistantRouter);


// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server started on ${PORT}`);
    connectDB();
});
