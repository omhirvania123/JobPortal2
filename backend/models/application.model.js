import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{ // legacy status kept for UI badges
        type:String,
        enum:['pending', 'accepted', 'rejected'],
        default:'pending'
    },
    stage:{
        type:String,
        enum:['pending','shortlisted','interview_scheduled','interview_completed','offer','hired','rejected'],
        default:'pending'
    },
    interview:{
        scheduledAt:{type:Date},
        mode:{type:String, enum:['online','onsite']},
        location:{type:String},
        meetLink:{type:String},
        notes:{type:String},
        candidateResponse:{type:String, enum:['none','accepted','declined'], default:'none'},
        responseAt:{type:Date}
    },
    assessment:{
        url:{type:String},
        dueAt:{type:Date},
        submissionUrl:{type:String},
        submittedAt:{type:Date},
        result:{type:String, enum:['pending','pass','fail'], default:'pending'},
        score:{type:Number}
    },
    notes:[{
        text:{type:String},
        author:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
        createdAt:{type:Date, default:Date.now}
    }]
},{timestamps:true});
export const Application  = mongoose.model("Application", applicationSchema);