import nodemailer from "nodemailer"
import fs from "fs"

const logs = []

export const sendMail = async () => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
    // create attachments array of screenshots
    const attachments = []
    fs.readdirSync("./screenshots").forEach((file) => {
      attachments.push({
        filename: file,
        path: `./screenshots/${file}`,
      })
    })

    // send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: process.env.EMAIL_USER, // list of receivers
      subject: "Virgin Pulse Stats", // Subject line
      text: "Virgin Pulse Logs: \n" + logs.join("\n"), // plain text body
      html: "<b>Virgin Pulse Logs: </b> <br />" + logs.join("<br />"), // html body
      attachments,
    })

    console.log("Message sent: %s", info.messageId)
  }
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
// random wait time between 1 and 2 seconds
export const randomWaitTime = (): number => 1000 + Math.random() * 2000

export const logger = (msg: string) => {
  logs.push(msg)
  console.log(msg)
}
