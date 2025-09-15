import express from "express";
import { errors } from "celebrate";
import { ValidationError } from "../../domain/errors/validation.error";
import { NotFoundError } from "../../domain/errors/not-found.error";
import { InternalServerError } from "../../domain/errors/internal-server.error";
import { ErrorBase } from "../../domain/errors/base.error";

/**
 * Error handling middleware for Express applications.
 * This middleware catches errors thrown in the application and sends a generic error response.
 *
 * @param {express.Application} app - The Express application instance.
 */
export const errorHandler = (app: express.Application) => {
  app.use(errors());
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (!(err instanceof ErrorBase)) {
        console.error("Unexpected error occurred:", err);
      }

      if (err instanceof ValidationError) {
        err.send(res);
      } else if (err instanceof NotFoundError) {
        err.send(res);
      } else if (err instanceof ErrorBase) {
        err.send(res);
      } else {
        new InternalServerError().send(res);
      }
    }
  );
};
