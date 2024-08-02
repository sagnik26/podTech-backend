import { PasswordResetToken } from "#/models/passwordresetToken";
import { VerifyEmailRequest } from "#/types/user";
import { RequestHandler, Response } from "express";

export const isValidPasswordresetToken: RequestHandler = async (req: VerifyEmailRequest, res: Response, next) => {
    const { token, userId } = req.body;
  
    const resetToken = await PasswordResetToken.findOne({
      owner: userId
    });
    if(!resetToken) return res.status(403).json({
      error: "Unautorized access, invalid token!"
    });
  
    const matched = await resetToken.compareToken(token);
    if(!matched) return res.status(403).json({
      error: "Unautorized access, invalid token!"
    });
  
    next();
  } 