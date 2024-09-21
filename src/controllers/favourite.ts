import Audio, { AudioDocument } from "#/models/audio";
import Favourite from "#/models/favourite";
import { PopulateFavList } from "#/types/audio";
import { categories } from "#/utils/audio_category";
import { RequestHandler } from "express";
import { ObjectId, isValidObjectId } from "mongoose";
import path from "path";
import { title } from "process";

export const toggleFavourite: RequestHandler = async (req, res) => {
    const audioId = req.query.audioId as string;
    let status: "added" | "removed";

    if(!isValidObjectId(audioId)) {
        return res.status(422).json({
            error: "Audio Id is invalid!"
        });
    }

    const audio = await Audio.findById(audioId);

    if(!audio) {
        return res.status(404).json({
            error: "Resources not found!"
        });
    }
    
    // audio is already in fav list
    const alreadyExists = await Favourite.findOne({ owner: req.user.id, items: audioId });
    if(alreadyExists) {
        // remove from old list
        await Favourite.updateOne({
            owner: req.user.id
        }, {
            $pull: { items: audioId }
        });

        status = "removed";
    }
    else {
        const favourite = await Favourite.findOne({ owner: req.user.id });
        if(favourite) {
            // trying to add new audio to old fav list
            await Favourite.updateOne({ owner: req.user.id }, {
                $addToSet: { items: audioId }
            });
        }
        else {
            // trying to create a fresh fav list
            await Favourite.create({ owner: req.user.id, items: [audioId] });
        }

        status = "added";
    }

    if(status === "added") {
        await Audio.findByIdAndUpdate(audioId, {
            $addToSet: { likes: req.user.id }
        })
    }

    if(status === "removed") {
        await Audio.findByIdAndUpdate(audioId, {
            $pull: { likes: req.user.id }
        })
    }

    return res.json({ status });
}

export const getFavourites: RequestHandler = async (req, res) => {
    const userId = req.user.id;

    const favourite = await Favourite.findOne({ owner: userId })
    .populate<{ items: PopulateFavList[] }>({
        path: "items", 
        populate: {
            path: "owner" 
        }
    });

    if(!favourite) return res.json({ audios: [] });

    const audios = favourite?.items.map((item) => {
        return {
            id: item._id,
            title: item.title,
            category: item.category,
            file: item.file.url,
            poster: item?.poster?.url,
            owner: { name: item.owner.name, id: item.owner._id }
        }
    })

    res.json([ audios ]);
}

export const getIsFavourite: RequestHandler = async (req, res) => {
    const audioId = req.query.audioId as string;

    if(!isValidObjectId(audioId)) {
        return res.status(422).json({
            error: "Audio Id is invalid!"
        });
    }

    const favourite = await Favourite.findOne({ owner: req.user.id, items: audioId });

    return res.json({
        result: favourite ? true : false
    });
}
