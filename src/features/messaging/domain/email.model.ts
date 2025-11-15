export interface SendEmailInput {
	to: string;
	subject: string;
	message: string;
}

export interface EmailSender {
	sendEmail(input: SendEmailInput): Promise<void>;
}

