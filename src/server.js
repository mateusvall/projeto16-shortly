import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dayjs from "dayjs";
import signUpRouter from "../routes/signup.router.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use(signUpRouter)

app.get('/status', (req, res) =>{
    res.sendStatus(200);
});

app.listen(process.env.PORT, () => console.log(`Magic is happening at port ${process.env.PORT}`))