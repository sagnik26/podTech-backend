import { Router } from "express";
import { CreateUserSchema, SignInValidationSchema, TokenAndIdVerificationBody, UpdatePasswordSchema } from "#/utils/validationSchema";
import { validate } from "#/middleware/validator";
import { create, verifyEmail, sendReVerificationToken, generateForgetPasswordLink, grantValid, updatepassword, signIn } from "#/controllers/user";
import { isValidPasswordresetToken, mustAuth } from "#/middleware/auth";
import { JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET } from "#/utils/variables";
import { User } from "#/models/user.model";
import { error, profile } from "console";

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

router.get('/is-auth', mustAuth, (req, res) => {
    return res.json({
        profile: req.user
    });
});

export default router;
