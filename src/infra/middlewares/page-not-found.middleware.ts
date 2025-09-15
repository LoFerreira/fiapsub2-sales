import express from "express";
import { NotFoundError } from "../../domain/errors/not-found.error";
/**
 * Middleware to handle 404 Not Found errors.
 * This middleware is used to catch all requests that do not match any defined routes.
 *
 * @param {express.Express} app - The Express application instance.
 */
export const pageNotFoundHandler = (app: express.Express) => {
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      next(new NotFoundError("Page not found"));
    }
  );
};
