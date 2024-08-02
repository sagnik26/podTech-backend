
import nodemailer from 'nodemailer';
import { MAILTRAP_USER, MAILTRAP_PASSWORD, MAILTRAP_HOST, MAILTRAP_PORT, SIGN_IN_URL } from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import { EmailVerificationToken } from "#/models/emailVerificationToken.model";
import { generateTemplate } from "#/mail/template";
import path from "path";

interface Profile {
    name: string;
    email: string;
    userId: string;
}

interface Options {
  email: string;
  link: string;
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

transport.sendMail({
    to: email,
    from: "gblu2468@gmail.com",
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

export const sendForgetPasswordLink = async (options: Options) => {
  const transport = generateMailTransporter();
  const { email, link } = options;
  const message = "We got the request that you forgot your password. You can use the link below and create a brand new password."
  
  transport.sendMail({
      to: email,
      from: "no-reply@gmail.com",
      subject: "Reset Password Link",
      html: generateTemplate({
        title: "Forget Password",
        message,
        logo: "cid:logo",
        banner: "cid:forget_password",
        link,
        btnTitle: "Reset Password"
      }),
      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../assets/logo.png"),
          cid: "logo"
        },
        {
          filename: "forget_password.png",
          path: path.join(__dirname, "../assets/forget_password.png"),
          cid: "forget_password"
        }
      ]
  })
}

export const sendPasswordResetSuccess = async (name: string, email: string) => {
  const transport = generateMailTransporter();
  const message = `Dear ${name}, We just updated your assword. You can now sign in with your new password.`
  
  transport.sendMail({
      to: email,
      from: "no-reply@gmail.com",
      subject: "Password Reset Successful",
      html: generateTemplate({
        title: "Password Reset Successful",
        message,
        logo: "cid:logo",
        banner: "cid:forget_password",
        link: SIGN_IN_URL,
        btnTitle: "Sign In"
      }),
      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../assets/logo.png"),
          cid: "logo"
        },
        {
          filename: "forget_password.png",
          path: path.join(__dirname, "../assets/forget_password.png"),
          cid: "forget_password"
        }
      ]
  })
}
