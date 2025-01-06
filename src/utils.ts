import fs from "node:fs";
import nodemailer from "nodemailer";
import { Message, SMTPClient } from "emailjs";

const logs = [] as string[];

type Screenshots = {
  type: string;
  name: string;
  path: string;
};

export const sendMail = async (points: string) => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    const client = new SMTPClient({
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASS,
      host: process.env.EMAIL_HOST,
      port: Number.parseInt(process.env.EMAIL_PORT ?? "465", 10),
      ssl: true,
    });

    // Create attachments array of screenshots
    const attachments = [] as Screenshots[];
    if (fs.existsSync("./screenshots")) {
      for (const file of fs.readdirSync("./screenshots")) {
        attachments.push({
          type: "image/png",
          name: file,
          path: `./screenshots/${file}`,
        });
      }
    }

    // Send email
    const messageOptions = {
      text: `Virgin Pulse Logs (${points}): \n` + logs.join("\n"), // Plain text body
      from: process.env.EMAIL_USER, // Sender address
      to: process.env.EMAIL_RECPT ?? process.env.EMAIL_USER, // List of receivers
      subject: `Virgin Pulse Stats: ${points}`, // Subject line
      attachment: attachments, // Attachments
    };
    const message = new Message(messageOptions);

    try {
      const message_ = await client.sendAsync(message);
      console.log(message_);
    } catch (error) {
      console.log("Failed to send email");
      console.log(error);
    }
    // Console.log("Message sent: %s", info.messageId)
  } else {
    console.log("No Valid Email Vars detected -- skipping...  ");
  }
};

export const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms)); // eslint-disable-line no-promise-executor-return

// Random wait time between 1 and 2 seconds
export const randomWaitTime = (): number => 1000 + Math.random() * 2000;

export const logger = (message: string) => {
  logs.push(message);
  console.log(message);
};
