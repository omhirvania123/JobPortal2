import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { deleteJob, getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
// Make public for browsing without login
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(getJobById);
router.route("/delete/:id").delete(isAuthenticated, deleteJob);

export default router;

