import express from "express";

export class ErrorBase extends Error {
  constructor(private status: number, message: string) {
    super(message);
  }

  send(res: express.Response) {
    res.status(this.status).send({ message: this.message });
  }
}
