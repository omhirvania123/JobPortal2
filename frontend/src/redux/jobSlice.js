import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name:"job",
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob:null, 
        searchJobByText:"",
        allAppliedJobs:[],
        searchedQuery:"",
    },
    reducers:{
        // actions
        setAllJobs:(state,action) => {
            state.allJobs = action.payload;
        },
        setSingleJob:(state,action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs:(state,action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText:(state,action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs:(state,action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery:(state,action) => {
            state.searchedQuery = action.payload;
        },
        removeJobsByCompanyId:(state, action) => {
            const companyId = action.payload;
            state.allAdminJobs = state.allAdminJobs.filter(job => job.company?._id !== companyId);
        },
        clearAllAdminJobs:(state) => {
            state.allAdminJobs = [];
        },
        clearAllJobs:(state) => {
            state.allJobs = [];
        }
    }
});
export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setSearchedQuery,
    removeJobsByCompanyId,
    clearAllAdminJobs,
    clearAllJobs
} = jobSlice.actions;
export default jobSlice.reducer;