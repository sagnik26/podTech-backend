import { getAutoGeneratedPlaylist, getFollowersProfile, getFollowersProfilePublic, getFollowingsProfile, getPublicPlaylist, getPublicProfile, getPublicUploads, getRecommendedByProfile, getUploads, updateFollower } from "#/controllers/profile";
import { isAuth, mustAuth } from "#/middleware/auth";
import { Router } from "express";

const router = Router();

router.post("/update-follower/:profileId", mustAuth, updateFollower);
router.get("/uploads", mustAuth, getUploads);
router.get("/uploads/:profileId", getPublicUploads);
router.get("/info/:profileId", getPublicProfile);
router.get("/playlist/:profileId", getPublicPlaylist);
router.get("/recommended", isAuth, getRecommendedByProfile);
router.get("/auto-generated-playlist", mustAuth, getAutoGeneratedPlaylist);
router.get("/followers", mustAuth, getFollowersProfile);
router.get("/followers/:profileId", mustAuth, getFollowersProfilePublic);
router.get("/followings", mustAuth, getFollowingsProfile);

export default router;
