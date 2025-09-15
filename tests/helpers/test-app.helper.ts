import express from "express";
import { routes } from "../../src/infra/routes";
import { pageNotFoundHandler } from "../../src/infra/middlewares/page-not-found.middleware";
import { errorHandler } from "../../src/infra/middlewares/error-handler.middleware";

export const createTestApp = () => {
  const app = express();

  routes(app);

  pageNotFoundHandler(app);

  errorHandler(app);

  return app;
};

export const extractJsonResponse = (res: any) => {
  try {
    return typeof res.text === "string" ? JSON.parse(res.text) : res.body;
  } catch {
    return res.text || res.body;
  }
};
