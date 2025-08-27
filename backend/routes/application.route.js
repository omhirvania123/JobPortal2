import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus, shortlistApplicant, scheduleInterview, respondInterview, completeInterview, assignAssessment, submitAssessment, finalDecision, addNote, deleteApplicant } from "../controllers/application.controller.js";
 
const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/shortlist/:id").post(isAuthenticated, shortlistApplicant);
router.route("/schedule-interview/:id").post(isAuthenticated, scheduleInterview);
router.route("/respond-interview/:id").post(isAuthenticated, respondInterview);
router.route("/complete-interview/:id").post(isAuthenticated, completeInterview);
router.route("/assessment/assign/:id").post(isAuthenticated, assignAssessment);
router.route("/assessment/submit/:id").post(isAuthenticated, submitAssessment);
router.route("/decision/:id").post(isAuthenticated, finalDecision);
router.route("/notes/:id").post(isAuthenticated, addNote);
router.route("/delete/:id").delete(isAuthenticated, deleteApplicant);
 

export default router;

