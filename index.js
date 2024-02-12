// ES module
import express, { response } from "express";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import contactsRouter from "./routes/contactRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import connectDb from "./config/dbConnection.js";
import userRouter from "./routes/userRoutes.js";

// CommonJS
// const express = require("express");
// const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000; // Use the defined port or default to 3000
connectDb();

app.get('/', (request, response) =>{
    response.status(200).send("This is base url");
});

app.use(express.json());
app.use("/api/contacts", contactsRouter); // Using the contacts router
app.use("/api/users", userRouter);
app.use(errorHandler);

app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
})

