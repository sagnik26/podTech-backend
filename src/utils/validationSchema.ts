import { isValidObjectId } from 'mongoose';
import { title } from 'process';
import * as yup from 'yup';
import { categories } from './audio_category';

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

export const SignInValidationSchema = yup.object({
        email: yup.string().required("Email is missing!").email("Invalid Email Id!"),
        password: yup.string()
        .trim()
        .required("Password is missing!")
        .min(8, "Password is too short!")
});


export const AudioValidationSchema = yup.object({
        title: yup.string().required("Title is missing!"),
        about: yup.string().required("About is missing!"),
        category: yup.string().oneOf(categories, "Invalid category!").required("category is missing!")
});

/*
*** while creating playlist, there can be request with new playlist name and 
    audio that the user wants to store inside that playlist.
*** Or, the user wants to create an empty playlist.
*/
export const NewPlaylistValidationSchema = yup.object({
        title: yup.string().required("Title is missing!"),
        resId: yup.string().transform(function(value) {
           return this.isType(value) && isValidObjectId(value) ? value : "";
        }),
        visibility: yup
                .string()
                .oneOf(["public", "private"], "Visibility must be public or private!")
                .required("Visibility is missing!")
});

export const OldPlaylistValidationSchema = yup.object({
        title: yup.string().required("Title is missing!"),
        // this is going to validate the audio id
        item: yup.string().transform(function(value) {
           return this.isType(value) && isValidObjectId(value) ? value : "";
        }),
        // this is going to validate the playlist id
        id: yup.string().transform(function(value) {
                return this.isType(value) && isValidObjectId(value) ? value : "";
        }),
        visibility: yup
                .string()
                .oneOf(["public", "private"], "Visibility must be public or private!")
});

export const UpdateHistorySchema = yup.object({
        audio: yup.string().transform(function(value) {
           return this.isType(value) && isValidObjectId(value) ? value : "";
        }).required("Invalid Audio Id!"),
        progress: yup.number().required("History progress is missing!"),
        date: yup.string().transform(function (value) {
                const date = new Date(value);
                if(date instanceof Date) return value;
                return "";
        }).required("Invalid Date!"),
});
