import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name:'application',
    initialState:{
        applicants:null,
    },
    reducers:{
        setAllApplicants:(state,action) => {
            state.applicants = action.payload;
        },
        removeApplicantById:(state, action) => {
            const id = action.payload;
            if(state.applicants && Array.isArray(state.applicants.applications)){
                state.applicants.applications = state.applicants.applications.filter(a => a._id !== id);
            }
        }
    }
});
export const {setAllApplicants, removeApplicantById} = applicationSlice.actions;
export default applicationSlice.reducer;