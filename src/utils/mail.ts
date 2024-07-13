
import nodemailer from 'nodemailer';
import { MAILTRAP_USER, MAILTRAP_PASSWORD, MAILTRAP_HOST, MAILTRAP_PORT } from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import { EmailVerificationToken } from "#/models/emailVerificationToken.model";
import { generateTemplate } from "#/mail/template";
import path from "path";

interface Profile {
    name: string;
    email: string;
    userId: string;
}

const generateMailTransporter = () => {
    const transport = nodemailer.createTransport({
        host: MAILTRAP_HOST,
        port: MAILTRAP_PORT,
        secure: false,
        auth: {
          user: MAILTRAP_USER,
          pass: MAILTRAP_PASSWORD
        }
    });

    return transport
}

export const sendVerificationMail = async (profile: Profile, token: string) => {
const transport = generateMailTransporter();
const { name, email, userId } = profile;
const welcomeMessage = `Hi ${name}, welcome to podify. Please use the OTP below to verify your email.`

await EmailVerificationToken.create({
  owner: userId,
  token
})
  
transport.sendMail({
    to: email,
    from: "no-reply@gmail.com",
    subject: "Podify OTP for verification",
    html: generateTemplate({
      title: "Welcome to Podify app",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../assets/logo.png"),
        cid: "logo"
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../assets/welcome.png"),
        cid: "welcome"
      }
    ]
})
}

