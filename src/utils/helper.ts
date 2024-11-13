import { UserDocument } from "#/models/user.model";
import { Request } from "express";
import moment from "moment";
import History from "#/models/history";

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
 
export const getUserPreviousHistory = async (req: Request) => {
    const user = req.user;

    const usersPrevHistories = await History.aggregate([
        {
            $match: { owner: user.id }
        },
        {
            $unwind: "$all"
        },
        {
            $match: {
                "all.date" : {
                    $gte: moment().subtract(30, "days").toDate()
                }
            }
        },
        {
            $group: { _id: "$all.audio" }
        },
        {
            $lookup: {
                from: "audios",
                localField: "_id",
                foreignField: "_id",
                as: "audioData"
            }
        },
        {
            $unwind: "$audioData"
        },
        {
            $group: {
                _id: null,
                category: {
                    $addToSet: "$audioData.category"
                }
            }
        }
    ]);

    const result = usersPrevHistories[0];

    if(result) {
        return result.category;
    }

    return [];
}
