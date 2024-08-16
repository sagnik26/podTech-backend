import { Router } from "express";
import { CreateUserSchema, SignInValidationSchema, TokenAndIdVerificationBody, UpdatePasswordSchema } from "#/utils/validationSchema";
import { validate } from "#/middleware/validator";
import { 
    create, 
    verifyEmail, 
    sendReVerificationToken, 
    generateForgetPasswordLink, 
    grantValid, 
    updatepassword, 
    signIn, 
    updateProfile, 
    sendProfile 
} from "#/controllers/auth";
import { isValidPasswordresetToken, mustAuth } from "#/middleware/auth";
import fileParser from "#/middleware/fileParser";

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

router.post(
    '/sign-in', 
    validate(SignInValidationSchema), 
    signIn
);

router.get('/is-auth', mustAuth, sendProfile);

router.post('/update-profile', mustAuth, fileParser, updateProfile);

export default router;
