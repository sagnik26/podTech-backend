import { Router } from "express";
import { CreateUserSchema, TokenAndIdVerificationBody, UpdatePasswordSchema } from "#/utils/validationSchema";
import { validate } from "#/middleware/validator";
import { create, verifyEmail, sendReVerificationToken, generateForgetPasswordLink, grantValid, updatepassword } from "#/controllers/user";
import { isValidPasswordresetToken } from "#/middleware/auth";

const router = Router();

router.post('/create', validate(CreateUserSchema), create);

router.post('/verify-email', validate(TokenAndIdVerificationBody), verifyEmail);

router.post('/re-verify-email', sendReVerificationToken);

router.post('/forget-password', generateForgetPasswordLink);

router.post(
    '/verify-pass-reset-token', 
    validate(TokenAndIdVerificationBody), 
    isValidPasswordresetToken,
    grantValid
);

router.post(
    '/update-password', 
    validate(UpdatePasswordSchema), 
    isValidPasswordresetToken,
    updatepassword
);


export default router;
