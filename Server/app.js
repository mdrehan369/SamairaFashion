import express from "express";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import reviewRouter from "./routes/review.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import crypto from "crypto"
import axios from "axios";
import sha256 from "sha256";

const app = express();

// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }))

app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(cookieParser());
app.use(express.json({limit: '16kb'}));


app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payments", paymentRouter)

export default app;
