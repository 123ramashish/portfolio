import nodemailer from 'nodemailer'
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, subject, message } = req.body as {
      name: string;
      email: string;
      subject: string;
      message: string;
    };

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: "ramashish62127@gmail.com",
      subject: subject,
      text: message,
      html: `<div><p>Message from Profolio to Hire or Contact</p><p>Name: ${name}</p><p>Email: ${email}</p><p>Project/Job/contact: ${subject}</p><p>Message: ${message}</p></div>`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Your message has been sent!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({
        error: "Failed to send your message. Please try again later.",
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
