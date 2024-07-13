import { User } from "#/models/user.model";
import { CreateUser } from "#/types/user";
import { RequestHandler, Response } from "express";
import { generateToken } from "#/utils/helper";
import { sendVerificationMail } from "#/utils/mail";

export const create: RequestHandler = async (req: CreateUser, res: Response) => {
    const { name, email, password } = req.body;
    const newUser = await User.create({ name, email, password });
    
    // Send Verification Email
    const token = generateToken(6);

    await sendVerificationMail({
      name,
      email,
      userId: newUser._id.toString()
    }, token.toString());
    
    res.status(201).json({ newUser });
}

