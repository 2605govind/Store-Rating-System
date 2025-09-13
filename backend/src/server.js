import express from 'express';
import "dotenv/config"
import postgreDb from './config/postgreSQL.js'
import cookieParser from "cookie-parser";
import cors from 'cors'

import path from "path";

import authRouter from './routes/authRouter.js'
import userRouter from './routes/userRouter.js'
import storeOwnerRouter from './routes/storeOwnerRouter.js'
import adminRouter from './routes/adminRouter.js'


const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))



app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/store-owner', storeOwnerRouter);
app.use('/admin', adminRouter);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
    try {
        postgreDb.connect()
            .then(client => {
                console.log("Database connected successfully!");
                client.release(); 

                console.log("Server is running at PORT " + PORT);
            })
            .catch(err => {
                console.error("Database connection error: ", err);
            });
    } catch (error) {
        console.log(error)
    }

})