/* @flow */
import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
// Types
import type { EmailRequestType } from "../../models/notification-request";

export default class EmailSendGridProvider {
  id: string;
  transporter: Object;

  constructor(config: Object) {
    this.id = "email-sendgrid-provider";
    const sgOptions = {
      auth: {
        api_key: config.apiKey
      }
    };
    this.transporter = nodemailer.createTransport(sgTransport(sgOptions));
  }

  async send(request: EmailRequestType): Promise<string> {
    const result = await this.transporter.sendMail(request);
    return result.messageId;
  }
}
