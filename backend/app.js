import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToMongoDB from './config/db.config.js';
import cookieParser from 'cookie-parser';


import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
import userRouter from './routes/user.router.js';


dotenv.config();

const app= express();
const PORT=3500;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.send('Hello from server')
})

app.use('/api/auth', authRouter);
app.use('/api/messages',messageRouter);
app.use('/api/users', userRouter);

app.listen(PORT, ()=>{
    connectToMongoDB();
    console.log(`server is running on http://localhost:${PORT}`);
    
})