import { Router } from "express";
import { syncDb } from "../controllers/db.js";

export const dbRouter = Router();
dbRouter.get("/", (req, res) => {
  res.send("This is DB root");
});
dbRouter.post("/sync", syncDb);
