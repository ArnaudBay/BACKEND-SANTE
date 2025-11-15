import type { EmailSender, SendEmailInput } from "../domain/email.model";

export class ConsoleEmailSender implements EmailSender {
	async sendEmail(input: SendEmailInput): Promise<void> {
		console.log("Email envoyé", input);
	}
}

