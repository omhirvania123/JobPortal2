import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const fitlerData = [
    {
        fitlerType: "Location",
        array: [
            "Bengaluru",
            "Hyderabad",
            "Pune",
            "Chennai",
            "Mumbai",
            "Delhi NCR",
            "Gurugram",
            "Noida",
            "Ahmedabad",
            "Kolkata"
        ]
    },
    {
        fitlerType: "Job Type",
        array: ["Remote", "On-site", "Hybrid", "Full-time", "Part-time", "Contract"]
    },
    {
        fitlerType: "Job Role",
        array: [
            "Frontend Developer",
            "Backend Developer",
            "Full Stack Developer",
            "UI/UX Designer",
            "DevOps Engineer",
            "Data Scientist"
        ]
    },
    {
        fitlerType: "Salary",
        array: ["0-40k", "40k-80k", "80k-140k", "140k+"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();
    const changeHandler = (value) => {
        setSelectedValue(value);
    }
    useEffect(()=>{
        dispatch(setSearchedQuery(selectedValue));
    },[selectedValue]);
    const clearFilters = () => {
        setSelectedValue('');
    }
    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <div className='flex justify-end mb-2'>
                <button onClick={clearFilters} className='text-xs underline text-blue-600'>Clear</button>
            </div>
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {
                    fitlerData.map((data, index) => (
                        <div>
                            <h1 className='font-bold text-lg'>{data.fitlerType}</h1>
                            {
                                data.array.map((item, idx) => {
                                    const itemId = `id${index}-${idx}`
                                    return (
                                        <div className='flex items-center space-x-2 my-2'>
                                            <RadioGroupItem value={item} id={itemId} />
                                            <Label htmlFor={itemId}>{item}</Label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
    )
}

export default FilterCard