import nodemailer from "nodemailer"
import { Message, SMTPClient } from "emailjs"
import fs from "fs"

const logs = []

export const sendMail = async (points: string) => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    const client = new SMTPClient({
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASS,
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      ssl: true,
    })

    // create attachments array of screenshots
    const attachments = []
    if (fs.existsSync("./screenshots")) {
      fs.readdirSync("./screenshots").forEach((file) => {
        attachments.push({
          type: "image/png",
          name: file,
          path: `./screenshots/${file}`,
        })
      })
    }

    // send email
    const messageOpts = {
      text: `Virgin Pulse Logs (${points}): \n` + logs.join("\n"), // plain text body
      from: process.env.EMAIL_USER, // sender address
      to: process.env.EMAIL_RECPT || process.env.EMAIL_USER, // list of receivers
      subject: `Virgin Pulse Stats: ${points}`, // Subject line
      attachment: attachments, // attachments
    }
    const message = new Message(messageOpts)

    try {
      const msg = await client.sendAsync(message)
      console.log(msg)
    } catch (e) {
      console.log("Failed to send email")
      console.log(e)
    }
    // console.log("Message sent: %s", info.messageId)
  } else {
    console.log("No Valid Email Vars detected -- skipping...  ")
  }
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
// random wait time between 1 and 2 seconds
export const randomWaitTime = (): number => 1000 + Math.random() * 2000

export const logger = (msg: string) => {
  logs.push(msg)
  console.log(msg)
}
