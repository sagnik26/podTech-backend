import { compare, hash } from "bcrypt";
import { Model, ObjectId, Schema, model } from "mongoose";

interface PasswordResetTokenDocument {
    owner: ObjectId;
    token: string;
    createdAt: Date;
}

interface Methods {
    compareToken(token: string): Promise<boolean>
}

const passwordResetTokenSchema = new Schema<PasswordResetTokenDocument, {}, Methods>({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    token: {
      type: String,
      required: true  
    },
    createdAt: {
        type: Date,
        expires: 3600, // 1hr = 60min = 3600sec 
        default: Date.now()
    }
}, {
    timestamps: true
});

passwordResetTokenSchema.pre("save", async function (next) {
    // hash the token 
    if(this.isModified("token")) {
        this.token = await hash(this.token, 10);
    }
    next();
});

passwordResetTokenSchema.methods.compareToken = async function (token: string) {
    const result = await compare(token, this.token);
    return result;
}

export const PasswordResetToken = model("PasswordResetToken", passwordResetTokenSchema) as Model<PasswordResetTokenDocument, {}, Methods>;
