import express from "express";
import dotenv from "dotenv";
import { routes } from "./Routes/Routes.js";
import { ConnectToDatabase } from "./Config/Config.js";
import cors from "cors";
import { sendEmail } from "./Lib/sendEmail.js";
dotenv.config();
import "express-async-errors";

const app = express();
const port = process.env.PORT || 4000;

ConnectToDatabase();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
