import express from "express";
import { getDb } from "../config/mongodb";

const router = express.Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

router.get("/health/db", async (_req, res) => {
  try {
    const db = getDb();
    await db.command({ ping: 1 });
    res.status(200).json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(503).json({
      status: "error",
      db: "unavailable",
      message: (err as any)?.message,
    });
  }
});

export default router;
