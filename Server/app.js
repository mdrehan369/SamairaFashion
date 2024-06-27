import express from "express";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import reviewRouter from "./routes/review.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors({
    // origin: ['http://localhost:5173', 'https://samairafashion-1.onrender.com'],
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

app.use(express.static(path.join(__dirname, "/dist")));

app.use(cookieParser());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payments", paymentRouter)

export default app;
