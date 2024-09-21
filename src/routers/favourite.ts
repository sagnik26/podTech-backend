import { getFavourites, getIsFavourite, toggleFavourite } from "#/controllers/favourite";
import { isVerified, mustAuth } from "#/middleware/auth";
import { Router } from "express";

const router = Router();

router.post('/', 
    mustAuth,
    isVerified,
    toggleFavourite
);

router.get('/', 
    mustAuth,
    isVerified,
    getFavourites
);

router.get("/is-fav", mustAuth, getIsFavourite);

export default router;
