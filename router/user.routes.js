import { Router } from "express";
import { addUser } from "../controller/user.controller.js";
import { increaseLike } from "../controller/user.controller.js";
import { decreasedLike } from "../controller/user.controller.js";
import { all } from "../controller/user.controller.js";
import { likeCount } from "../controller/user.controller.js";

const router = Router();

router.route("/addUser").post(addUser);
router.route("/like").post(increaseLike);
router.route("/dislike").post(decreasedLike);
router.route("/all").get(all);
router.route("/likeCount").post(likeCount);

export default router;
