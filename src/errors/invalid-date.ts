import { ClientError } from "./client-error";

export class InvalidDate extends ClientError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidDate";
  }
}
