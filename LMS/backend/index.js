import express from "express"
import chatbotRoute from "./routes/chatbotRoute.js";
import dotenv from "dotenv"
import connectDb from "./configs/db.js"
import authRouter from "./routes/authRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/userRoute.js"
import courseRouter from "./routes/courseRoute.js"
import paymentRouter from "./routes/paymentRoute.js"
import aiRouter from "./routes/aiRoute.js"
import reviewRouter from "./routes/reviewRoute.js"
import certificateRouter from "./routes/certificateRoute.js"


dotenv.config()

// ADD THIS LINE 👇
console.log("OPENAI KEY:", process.env.OPENAI_API_KEY);

let port = process.env.PORT
let app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/ai", aiRouter)
app.use("/api/review", reviewRouter)
app.use("/api", chatbotRoute)
app.use("/notes", express.static("public/notes"))
app.use("/api/certificate",certificateRouter)
app.use("/certificates",express.static("public/certificates"))



app.get("/" , (req,res)=>{
    res.send("Hello From Server")
})

app.listen(port , ()=>{
    console.log("Server Started")
    connectDb()
})