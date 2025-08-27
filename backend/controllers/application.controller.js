import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}

// new: shortlist applicant
export const shortlistApplicant = async (req,res) => {
    try{
        const applicationId = req.params.id;
        const application = await Application.findById(applicationId);
        if(!application){
            return res.status(404).json({ message: "Application not found.", success:false });
        }
        application.stage = 'shortlisted';
        application.status = 'pending';
        await application.save();
        return res.status(200).json({ message:'Applicant shortlisted.', success:true });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message:'Internal server error.', success:false });
    }
}

export const scheduleInterview = async (req,res) => {
    try{
        const applicationId = req.params.id;
        const { scheduledAt, mode, location, meetLink, notes } = req.body;
        const application = await Application.findById(applicationId);
        if(!application){
            return res.status(404).json({ message: "Application not found.", success:false });
        }
        application.stage = 'interview_scheduled';
        application.interview = { scheduledAt, mode, location, meetLink, notes, candidateResponse:'none' };
        await application.save();
        return res.status(200).json({ message:'Interview scheduled.', success:true });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message:'Internal server error.', success:false });
    }
}

export const respondInterview = async (req,res) => {
    try{
        const applicationId = req.params.id;
        const { response } = req.body; // accepted | declined
        const application = await Application.findById(applicationId);
        if(!application){
            return res.status(404).json({ message: "Application not found.", success:false });
        }
        application.interview = {
            ...application.interview,
            candidateResponse: response,
            responseAt: new Date()
        };
        await application.save();
        return res.status(200).json({ message:`Interview ${response}.`, success:true });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message:'Internal server error.', success:false });
    }
}

export const completeInterview = async (req,res) => {
    try{
        const applicationId = req.params.id;
        const application = await Application.findById(applicationId);
        if(!application){
            return res.status(404).json({ message: "Application not found.", success:false });
        }
        application.stage = 'interview_completed';
        await application.save();
        return res.status(200).json({ message:'Interview completed.', success:true });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message:'Internal server error.', success:false });
    }
}

export const assignAssessment = async (req,res) => {
    try{
        const applicationId = req.params.id;
        const { url, dueAt } = req.body;
        const application = await Application.findById(applicationId);
        if(!application){
            return res.status(404).json({ message: "Application not found.", success:false });
        }
        application.assessment = { url, dueAt };
        await application.save();
        return res.status(200).json({ message:'Assessment assigned.', success:true });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message:'Internal server error.', success:false });
    }
}

export const submitAssessment = async (req,res) => {
    try{
        const applicationId = req.params.id;
        const { submissionUrl } = req.body;
        const application = await Application.findById(applicationId);
        if(!application){
            return res.status(404).json({ message: "Application not found.", success:false });
        }
        application.assessment = { ...application.assessment, submissionUrl, submittedAt: new Date() };
        await application.save();
        return res.status(200).json({ message:'Assessment submitted.', success:true });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message:'Internal server error.', success:false });
    }
}

export const finalDecision = async (req,res) => {
    try{
        const applicationId = req.params.id;
        const { decision, score } = req.body; // offer | hired | rejected; optional score for assessment
        const application = await Application.findById(applicationId);
        if(!application){
            return res.status(404).json({ message: "Application not found.", success:false });
        }
        if (decision === 'offer') application.stage = 'offer';
        if (decision === 'hired') application.stage = 'hired';
        if (decision === 'rejected') application.stage = 'rejected';
        if (typeof score === 'number') {
            application.assessment = { ...application.assessment, score, result: score >= 50 ? 'pass' : 'fail' };
        }
        await application.save();
        return res.status(200).json({ message:'Decision recorded.', success:true });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message:'Internal server error.', success:false });
    }
}

export const addNote = async (req,res) => {
    try{
        const applicationId = req.params.id;
        const { text } = req.body;
        if(!text){ return res.status(400).json({ message:'text is required', success:false }); }
        const application = await Application.findById(applicationId);
        if(!application){ return res.status(404).json({ message:'Application not found.', success:false }); }
        application.notes.push({ text, author: req.id });
        await application.save();
        return res.status(200).json({ message:'Note added.', success:true });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message:'Internal server error.', success:false });
    }
}

export const deleteApplicant = async (req, res) => {
    try{
        const applicationId = req.params.id;
        const recruiterId = req.id;
        const application = await Application.findById(applicationId);
        if(!application){
            return res.status(404).json({ message:'Application not found.', success:false });
        }
        // ensure recruiter owns the job
        const job = await Job.findById(application.job);
        if(!job || String(job.created_by) !== String(recruiterId)){
            return res.status(403).json({ message:'Not authorized.', success:false });
        }
        // remove application reference from job
        job.applications = job.applications.filter(id => String(id) !== String(applicationId));
        await job.save();
        await application.deleteOne();
        return res.status(200).json({ message:'Applicant removed.', success:true });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message:'Internal server error.', success:false });
    }
}