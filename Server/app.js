import express from "express";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(cookieParser());
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true}))
// app.use()

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

export default app;
