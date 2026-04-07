import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import eventRoutes from "./routes/event.route.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use('/api/events', eventRoutes)

app.get("/", (req, res) => {
    res.send("Your Seatify is online")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Your app is running in the PORT ${PORT}`)
})