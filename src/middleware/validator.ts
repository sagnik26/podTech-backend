import * as yup from "yup";
import { RequestHandler } from "express";

export const validate = (schema: any): RequestHandler => {
    return async (req, res, next) => {
        if(!req.body) {
            return res.status(422).json({
                error: "Empty body is not expected!"
            })
        }

        const schemaToValidate = yup.object({
            body: schema
        });

        try {
            await schemaToValidate.validate({
                body: req.body
            }, {
                abortEarly: true
            });

            next();
        }
        catch (error: any) {
            if(error instanceof yup.ValidationError) {
                res.status(422).json({ error: error.message });
            }
        }
    }
}