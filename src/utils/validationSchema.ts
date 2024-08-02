import { isValidObjectId } from 'mongoose';
import * as yup from 'yup';

export const CreateUserSchema = yup.object().shape({
    name: yup.string()
            .trim()
            .required("Name is missing!")
            .min(3, "name is too short!")
            .max(20, "name is too long!"),
    email: yup.string()
            .required("Email is missing!")
            .email("Invalid email id!"),
    password: yup.string()
            .trim()
            .required("Password is missing!")
            .min(8, "Password is too short!")
            .matches(
                /[!@#$%^&*(),.?":{}|<>]/,
                "Password must contain atleast one symbol"
            )
            .matches(/[0-9]/, "Password must contain atleast one number")
            .matches(/[A-Z]/, "Password must contain atleast one uppercase letter")
            .matches(/[a-z]/, "Password must contain atleast one lowercase letter"),
});

export const TokenAndIdVerificationBody = yup.object({
   token: yup.string().trim().required("Invalid Token!"),
   userId: yup.string().transform(function(value) {
        if(this.isType(value) && isValidObjectId(value)) {
          return value;
        }
   
        return "";
   }).required("Invalid userId!")
});

export const UpdatePasswordSchema = yup.object({
        token: yup.string().trim().required("Invalid Token!"),
        userId: yup.string().transform(function(value) {
             if(this.isType(value) && isValidObjectId(value)) {
               return value;
             }
        
             return "";
        }).required("Invalid userId!"),
        password: yup.string()
        .trim()
        .required("Password is missing!")
        .min(8, "Password is too short!")
        .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain atleast one symbol"
        )
        .matches(/[0-9]/, "Password must contain atleast one number")
        .matches(/[A-Z]/, "Password must contain atleast one uppercase letter")
        .matches(/[a-z]/, "Password must contain atleast one lowercase letter"),
});
