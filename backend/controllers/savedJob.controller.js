import { SavedJob } from "../models/savedJob.model.js";

export const saveJob = async (req, res) => {
    try {
        const userId = req.id;
        const { jobId } = req.body;
        if (!jobId) {
            return res.status(400).json({ message: "jobId is required", success: false });
        }
        await SavedJob.updateOne({ job: jobId, user: userId }, { $set: { job: jobId, user: userId } }, { upsert: true });
        return res.status(200).json({ message: "Job saved", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const unsaveJob = async (req, res) => {
    try {
        const userId = req.id;
        const { jobId } = req.body;
        if (!jobId) {
            return res.status(400).json({ message: "jobId is required", success: false });
        }
        await SavedJob.deleteOne({ job: jobId, user: userId });
        return res.status(200).json({ message: "Job unsaved", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const listSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const saved = await SavedJob.find({ user: userId }).populate({ path: 'job', populate: { path: 'company' } }).sort({ createdAt: -1 });
        return res.status(200).json({ saved, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const isSaved = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({ message: "jobId param is required", success: false });
        }
        const doc = await SavedJob.findOne({ user: userId, job: jobId });
        return res.status(200).json({ saved: !!doc, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

