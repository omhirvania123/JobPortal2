import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name:"company",
    initialState:{
        singleCompany:null,
        companies:[],
        searchCompanyByText:"",
    },
    reducers:{
        // actions
        setSingleCompany:(state,action) => {
            state.singleCompany = action.payload;
        },
        setCompanies:(state,action) => {
            state.companies = action.payload;
        },
        setSearchCompanyByText:(state,action) => {
            state.searchCompanyByText = action.payload;
        },
        removeCompanyById:(state, action) => {
            const id = action.payload;
            state.companies = state.companies.filter(company => company._id !== id);
        }
    }
});
export const {setSingleCompany, setCompanies,setSearchCompanyByText, removeCompanyById} = companySlice.actions;
export default companySlice.reducer;