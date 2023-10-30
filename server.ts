import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Container } from "typedi";
import { Database } from "./database/database";
import { InMemoryDatabase } from "./database/inMemoryDatabase/inMemoryDatabase";
import initUrlShortenerModule from "./urlShortener";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Dependency Injection
Container.set(Database, new InMemoryDatabase());

const db = Container.get(Database);
db.connect();

initUrlShortenerModule(app);

const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
