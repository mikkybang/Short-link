import express, { Express, Request, Response } from "express";

const app: Express = express();



app.listen(3003, () => {
  console.log("Server running on port 3003");
});
