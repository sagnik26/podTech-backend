import { number } from "yup";

export const generateToken = (length: number) => {
    let otp = Math.floor(Math.random() * Math.pow(10, length));
    return otp
}