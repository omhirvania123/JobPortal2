import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { isSaved, listSavedJobs, saveJob, unsaveJob } from "../controllers/savedJob.controller.js";

const router = express.Router();

router.route("/save").post(isAuthenticated, saveJob);
router.route("/unsave").post(isAuthenticated, unsaveJob);
router.route("/list").get(isAuthenticated, listSavedJobs);
router.route("/is-saved/:id").get(isAuthenticated, isSaved);

export default router;

