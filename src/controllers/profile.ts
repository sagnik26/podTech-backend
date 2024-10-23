import { User } from "#/models/user.model";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import Audio from "#/models/audio";
import { error } from "console";
import Playlist from "#/models/playlist";

export const updateFollower: RequestHandler = async (req, res) => {
    const { profileId } = req.params;
    let status: "added" | "removed";

    if(!isValidObjectId(profileId)) {
        return res.json({
            error: "Invalid Profile Id!"
        })
    }

    const profile = await User.findById(profileId);

    if(!profile) {
        return res.status(404).json({
            error: "Profile not found!"
        })
    }

    const alreadyAFollower = await User.findOne({
        _id: profileId,
        followers: req.user.id
    });

    if(alreadyAFollower) {
        // unfollow the user
        console.log("Unfollow");
        await User.updateOne({
            _id: profileId
        }, {
            $pull: { followers: req.user.id }
        });

        await User.updateOne({
            _id: req.user.id
        }, {
            $pull: {
                followings: profileId
            }
        });

        status = "removed";
    }
    else {
        // follow the user
        console.log("Follow")
        await User.updateOne({
            _id: profileId
        }, {
            $addToSet: { followers: req.user.id }
        });

        await User.updateOne({
            _id: req.user.id
        }, {
            $addToSet: {
                followings: profileId
            }
        });

        status = "added";
    }

    // if(status = "added") {
    //     // update the following list (add)
    //     await User.updateOne({
    //         _id: req.user.id
    //     }, {
    //         $addToSet: {
    //             followings: profileId
    //         }
    //     });
    // }

    // if(status = "removed") {
    //     // remove from the following list (remove)
    //     await User.updateOne({
    //         _id: req.user.id
    //     }, {
    //         $pull: {
    //             followings: profileId
    //         }
    //     });
    // }

    res.json({ status });
}

export const getUploads: RequestHandler = async (req, res) => {
    const { pageNo="0", limit="20" } = req.query as paginationQuery

    const data = await Audio.find({ owner: req.user.id })
        .skip(parseInt(limit) * parseInt(pageNo))
        .limit(parseInt(limit))
        .sort("-createdAt");

    const audios = data.map((item: any) => {
        return {
            id: item._id,
            title: item.title,
            about: item.about,
            file: item.file?.url,
            poster: item.poster?.url,
            date: item.createdAt,
            owner: { 
                name: req.user.name,
                id: req.user.id
            }
        }
    });

    res.json({ audios });
}

export const getPublicUploads: RequestHandler = async (req, res) => {
    const { pageNo="0", limit="20" } = req.query as paginationQuery;
    const { profileId } = req.params;

    const data = await Audio.find({ owner: profileId })
        .skip(parseInt(limit) * parseInt(pageNo))
        .limit(parseInt(limit))
        .sort("-createdAt")
        .populate("owner");

    const audios = data.map((item: any) => {
        return {
            id: item._id,
            title: item.title,
            about: item.about,
            file: item.file?.url,
            poster: item.poster?.url,
            date: item.createdAt,
            owner: { 
                name: item.owner.name,
                id: item.owner._id
            }
        }
    });

    res.json({ audios });
}

export const getPublicProfile: RequestHandler = async (req, res) => {
    const { profileId } = req.params;

    if(!isValidObjectId(profileId)) {
        return res.status(422).json({
            error: "Invalid Profile Id!"
        });
    }

    const user = await User.findById(profileId);
    if(!user) {
        return res.status(422).json({
            error: "User not found!"
        });
    }

    res.json({
        profile: {
            id: user._id,
            name: user.name,
            followers: user.followers.length,
            avatar: user.avatar?.url
        }
    });
}

export const getPublicPlaylist: RequestHandler = async (req, res) => {
    const { profileId } = req.params;
    const { pageNo="0", limit="20" } = req.query as paginationQuery;

    if(!isValidObjectId(profileId)) {
        return res.status(422).json({
            error: "Invalid Profile Id!"
        });
    }

    const playlist = await Playlist.find({
        owner: profileId,
        visibility: 'public'
    })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit))
    .sort("-createdAt");

    if(!playlist) {
        return res.json({
            playlist: []
        });
    }

    res.json({
        playlist: playlist.map((item: any) => {
            return {
                id: item.id,
                title: item.title,
                itemsCount: item.items?.length,
                visibility: item.visibility,
            }
        })
    });
}
