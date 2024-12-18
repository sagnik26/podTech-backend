import { PasswordResetToken } from "#/models/passwordresetToken";
import { User } from "#/models/user.model";
import { VerifyEmailRequest } from "#/types/user";
import { JWT_SECRET } from "#/utils/variables";
import { error } from "console";
import { RequestHandler, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

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

export const mustAuth: RequestHandler = async (req, res, next) => {
    const { authorization } = req.headers;
    const token: string = authorization?.split("Bearer ")[1] as string;
    if(!token) {
        res.status(403).json({
            error: "Unauthorized request!"
        })
    }

    const payload = verify(token, JWT_SECRET) as JwtPayload;
    const id = payload.userId;

    const user = await User.findOne({
      _id: id,
      tokens: token
    });
    
    if(!user) {
        return res.status(403).json({
            error: "Unauthorized request!"
        });
    } 

    req.user = {     
          id: user._id,
          name: user.name,
          email: user.email,
          verified: user.verified,
          avatar: user.avatar?.url,
          followers: user.followers?.length,
          following: user.followings?.length
    }

    req.token = token;

    next();
}

export const isAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token: string = authorization?.split("Bearer ")[1] as string;
  
  if(token) {
    const payload = verify(token, JWT_SECRET) as JwtPayload;
    const id = payload.userId;
  
    const user = await User.findOne({
      _id: id,
      tokens: token
    });
    
    if(!user) {
        return res.status(403).json({
            error: "Unauthorized request!"
        });
    } 
  
    req.user = {     
          id: user._id,
          name: user.name,
          email: user.email,
          verified: user.verified,
          avatar: user.avatar?.url,
          followers: user.followers?.length,
          following: user.followings?.length
    }
    req.token = token;
  }

  next();
}

export const isVerified: RequestHandler = (req, res, next) => {
  if(!req.user.verified) {
    return res.status(403).json({
      error: "Please verify your email account!"
    });
  }

  next();
}

