import express from "express";
import cors from "cors";
import vehicleRoutes from "./vehicle.routes";
import paymentRoutes from "./payment.routes";
import healthRoutes from "./health.routes";
import { setupSwagger } from "../middlewares/swagger.middleware";

export const routes = (app: express.Express) => {
  app.use(
    cors({
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
      ],
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    );
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  app.use(express.json());

  setupSwagger(app);

  // Health endpoints first (cheap and fast)
  app.use(healthRoutes);

  app.use(vehicleRoutes);
  app.use(paymentRoutes);
};
