import { ErrorBase } from "./base.error";

export class InternalServerError extends ErrorBase {
  constructor(message = "Internal Server Error") {
    super(500, message);
  }
}
