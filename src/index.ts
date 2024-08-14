import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { google } from "googleapis";
import nodemailer from "nodemailer";

const app = express();

const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.G_ID,
  clientSecret: process.env.G_SE,
});

oauth2Client.setCredentials({
  refresh_token: process.env.G_RT,
});

app.get("/send", async (_, res) => {
  try {
    const token = await oauth2Client.getAccessToken();
    let transporter = nodemailer.createTransport({
      // @ts-ignore
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.G_USER,
        clientId: process.env.G_ID,
        clientSecret: process.env.G_SE,
        refreshToken: process.env.G_RT,
        accessToken: token.token,
      },
    });
    transporter.sendMail({
      to: "arridhaamrad@gmail.com",
      subject: "test node mailer",
      html: "<h1>Hello World</h1>",
    });
    return res.status(200).json({ mesage: "sent" });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

app.listen(5000, () => {
  console.log("Server running from port 5000 🚀🇵🇸");
});
