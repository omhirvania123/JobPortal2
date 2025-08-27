import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { SavedJob } from "../models/savedJob.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        
        const updateData = { name, description, website, location };
        // Make logo optional: only upload if a file is provided
        const file = req.file;
        if (file) {
            try {
                // If Cloudinary is not configured, skip changing the logo
                if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
                    console.warn("Cloudinary env not configured; skipping logo upload.");
                } else {
                    const fileUri = getDataUri(file);
                    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                    updateData.logo = cloudResponse.secure_url;
                }
            } catch (uploadErr) {
                console.error("Logo upload failed, proceeding without changing logo:", uploadErr?.message || uploadErr);
                // proceed without setting updateData.logo
            }
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message:"Company information updated.",
            success:true
        })

    } catch (error) {
        console.log(error);
        if (error?.code === 11000) {
            return res.status(409).json({ message: "Company name already exists.", success: false });
        }
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
}

export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const userId = req.id;

        // Find the company and ensure it belongs to the logged-in user
        const company = await Company.findOne({ _id: companyId, userId });
        
        if (!company) {
            return res.status(404).json({
                message: "Company not found or you don't have permission to delete it.",
                success: false
            });
        }

        // Get job count for response message
        const jobCount = await Job.countDocuments({ company: companyId });

        // Execute all deletions in parallel for maximum speed
        await Promise.all([
            // Delete all applications for jobs from this company
            Application.deleteMany({ 
                jobId: { 
                    $in: await Job.find({ company: companyId }).distinct('_id') 
                } 
            }),
            
            // Delete all saved jobs for jobs from this company
            SavedJob.deleteMany({ 
                jobId: { 
                    $in: await Job.find({ company: companyId }).distinct('_id') 
                } 
            }),
            
            // Delete all jobs associated with this company
            Job.deleteMany({ company: companyId }),
            
            // Delete the company
            Company.findByIdAndDelete(companyId)
        ]);

        return res.status(200).json({
            message: `Company and ${jobCount} associated jobs deleted successfully.`,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: "Internal server error.", 
            success: false 
        });
    }
}