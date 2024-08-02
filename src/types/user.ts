import { Request } from "express";

export interface CreateUser extends Request {
    body: {
        name: string;
        email: string;
        password: string;
    }
}

export interface VerifyEmailRequest extends Request {
    body: {
        userId: string;
        token: string;
        password?: string;
    }
}

export interface generateForgetPassword extends Request {
    body: {
        email: string;
    }
}
