import { ErrorBase } from "./base.error";

export class AlreadySoldError extends ErrorBase {
  constructor(message: string = "Vehicle already sold") {
    super(400, message);
  }
}
