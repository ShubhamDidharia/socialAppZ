import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';   
import postRoutes from './routes/post.routes.js';
import userRoutes from './routes/user.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import connectDB from './db/connectMongo.js';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary}  from 'cloudinary';
import path from 'path';
import cors from 'cors';


dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET

})

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cookieParser()); // Middleware to parse cookies from requests
app.use(express.json({limit : "5mb"}));  //  limit shouldnt be too large to avoid DoS attacks
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON and URL-encoded data


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectDB();
});