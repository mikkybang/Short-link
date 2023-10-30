import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import db from "./database/inMemoryDatabase";

dotenv.config();

const app: Express = express();

const port = process.env.PORT || 3003;

db.connect();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
