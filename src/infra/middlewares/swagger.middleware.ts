import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger.config";

export const setupSwagger = (app: express.Application): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      swaggerOptions: {
        docExpansion: "none",
        filter: true,
        showRequestHeaders: true,
      },
    })
  );

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};
