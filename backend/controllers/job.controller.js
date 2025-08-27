import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, role, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            role,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const { location, jobType, minSalary, maxSalary, minExp, maxExp } = req.query;
        const query = {
            $and: [
                {
                    $or: [
                        { title: { $regex: keyword, $options: "i" } },
                        { description: { $regex: keyword, $options: "i" } },
                    ]
                }
            ]
        };
        if (location) {
            query.$and.push({ location: { $regex: location, $options: "i" } });
        }
        if (jobType) {
            query.$and.push({ jobType: { $regex: `^${jobType}$`, $options: "i" } });
        }
        if (minSalary || maxSalary) {
            const range = {};
            if (minSalary) range.$gte = Number(minSalary);
            if (maxSalary) range.$lte = Number(maxSalary);
            query.$and.push({ salary: range });
        }
        if (minExp || maxExp) {
            const erange = {};
            if (minExp) erange.$gte = Number(minExp);
            if (maxExp) erange.$lte = Number(maxExp);
            query.$and.push({ experienceLevel: erange });
        }
        // First, get all existing company IDs to filter out jobs with deleted companies
        const { Company } = await import("../models/company.model.js");
        const existingCompanyIds = await Company.find({}, '_id');
        const existingCompanyIdSet = new Set(existingCompanyIds.map(c => c._id.toString()));
        
        // Add company filter to query to exclude jobs with deleted companies
        query.$and.push({ company: { $in: existingCompanyIds.map(c => c._id) } });
        
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        
        // First, get all existing company IDs to filter out jobs with deleted companies
        const { Company } = await import("../models/company.model.js");
        const existingCompanyIds = await Company.find({}, '_id');
        
        const jobs = await Job.find({ 
            created_by: adminId,
            company: { $in: existingCompanyIds.map(c => c._id) }
        }).populate({
            path:'company'
        }).sort({ createdAt: -1 });
        
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const adminId = req.id;
        const job = await Job.findOneAndDelete({ _id: jobId, created_by: adminId });
        if (!job) {
            return res.status(404).json({ message: 'Job not found or not authorized.', success: false });
        }
        return res.status(200).json({ message: 'Job deleted successfully.', success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error.', success: false });
    }
}
