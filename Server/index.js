import dotenv from "dotenv"
import connectDB from "./lib/connectDB.js";
import app from './app.js'
dotenv.config()

connectDB()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})