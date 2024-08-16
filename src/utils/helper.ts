import { UserDocument } from "#/models/user.model";

export const generateToken = (length: number) => {
    let otp = Math.floor(Math.random() * Math.pow(10, length));
    return otp
}

export const formatProfile = (user: UserDocument) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        avatar: user.avatar?.url,
        followers: user.followers?.length,
        following: user.followings?.length
    };
}
 