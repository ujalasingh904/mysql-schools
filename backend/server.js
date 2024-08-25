import schoolRoutes from "./routes/schoolRoutes.js"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
dotenv.config()


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const port = process.env.PORT || 5000;  
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
))

app.use('/api',schoolRoutes)

app.listen(port,()=>console.log("server listening on port: " + port + ' go to http://localhost:5000'));


