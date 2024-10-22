import { AudioDocument } from "#/models/audio";
import { ObjectId } from "mongoose";
import { Request } from "express";

export type PopulateFavList = AudioDocument<{ _id: ObjectId, name: string }>

export interface CreatePlaylistRequest extends Request {
    body: {
        title: string;
        resId: string;
        visibility: "public" | "private"
    }
}

export interface UpdatePlaylistRequest extends Request {
    body: {
        title: string;
        item: string;
        id: string;
        visibility: "public" | "private"
    }
}

