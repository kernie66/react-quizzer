import { Router } from "express";
import { syncDb } from "../controllers/db.js";

export const dbRouter = Router();
dbRouter.get("/", (req, res) => {
  res.status(200).json({ success: "This is DB root!" });
});
dbRouter.post("/sync", syncDb);
