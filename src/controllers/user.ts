import { User } from "#/models/user.model";
import { CreateUser, VerifyEmailRequest, generateForgetPassword } from "#/types/user";
import { RequestHandler, Response } from "express";
import { generateToken } from "#/utils/helper";
import { sendForgetPasswordLink, sendPasswordResetSuccess, sendVerificationMail } from "#/utils/mail";
import { EmailVerificationToken } from "#/models/emailVerificationToken.model";
import { isValidObjectId } from "mongoose";
import { PasswordResetToken } from "#/models/passwordresetToken";
import crypto from "crypto";
import { PASSWORD_RESET_LINK } from "#/utils/variables";
import { error } from "console";

export const create: RequestHandler = async (req: CreateUser, res: Response) => {
    const { name, email, password } = req.body;
    const newUser = await User.create({ name, email, password });
    
    // Send Verification Email
    const token = generateToken(6);

    await EmailVerificationToken.create({
      owner: newUser._id,
      token
    });

    await sendVerificationMail({
      name,
      email,
      userId: newUser._id.toString()
    }, token.toString());
    
    res.status(201).json({ user: { id: newUser._id, name,  email } });
}

export const verifyEmail: RequestHandler = async (req: VerifyEmailRequest, res: Response) => {
  const { token, userId } = req.body;
  
  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId
  });

  if(!verificationToken) return res.status(403).json({
    error: "Invalid token!"
  });

  const matched = await verificationToken.compareToken(token);
  if(!matched) return res.status(403).json({
    error: "Invalid token!"
  });

  // Updated verified property
  await User.findByIdAndUpdate(userId, {
    verified: true
  });

  // after verfication, remove token from DB
  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  return res.status(200).json({
    message: "Your email is verified"
  });
} 

export const sendReVerificationToken: RequestHandler = async (req: VerifyEmailRequest, res: Response) => {
  const { userId } = req.body;

  if(!isValidObjectId(userId)) return res.status(403).json({
    error: "Invalid Request!"
  });

  const user = await User.findById(userId);
  if(!user) return res.status(403).json({
    error: "Invalid Request!"
  });
  
  await EmailVerificationToken.findOneAndDelete({
    owner: userId
  });

  const token = generateToken(6);

  await EmailVerificationToken.create({
    owner: userId,
    token
  });

  await sendVerificationMail({
    name: user?.name,
    email: user?.email,
    userId: userId.toString()
  }, token.toString());

  res.json({ message: "Please check your mail." });
} 

export const generateForgetPasswordLink: RequestHandler = async (req: generateForgetPassword, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if(!user) return res.status(404).json({ error: "Account not found!" });

  await PasswordResetToken.findOneAndDelete({
    owner: user._id
  });

  //  generate the link - https://yourapp.com/reset-password?token=dcdscsdcdc789&userId=6798rhefeb45
  const token = crypto.randomBytes(36).toString('hex');

  await PasswordResetToken.create({
    owner: user._id,
    token
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendForgetPasswordLink({
    email: user.email,
    link: resetLink
  });

  res.json({ message: "Check your registered mail." });
} 

export const grantValid: RequestHandler = async (req: VerifyEmailRequest, res: Response) => {
  res.json({
    valid: true
  });
} 

export const updatepassword: RequestHandler = async (req: VerifyEmailRequest, res: Response) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if(!user) return res.status(403).json({
    error: "Unauthorized access!"
  });

  if(password) {
    const matched = await user.comparePassword(password);
    if(matched) return res.status(422).json({
      error: "The new password can't be same as the current one!"
    });

    user.password = password;
    await user.save();

    // Delete previous reset token
    await PasswordResetToken.findOneAndDelete({
      owner: user._id
    });

    // send mail for success
    sendPasswordResetSuccess(user.name, user.email);
    res.json({
      message: "Password Reset Successfull"
    });
  }
} 

