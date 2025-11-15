import { ConsoleEmailSender } from "./outbound/console-email.sender";

const emailSender = new ConsoleEmailSender();

export { emailSender };
export * from "./domain/email.model";

