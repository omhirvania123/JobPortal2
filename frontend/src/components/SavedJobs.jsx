import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { SAVED_API_END_POINT } from '@/utils/constant'
import { useNavigate } from 'react-router-dom'

const SavedJobs = () => {
    const [saved, setSaved] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        const load = async ()=>{
            try{
                const res = await axios.get(`${SAVED_API_END_POINT}/list`, { withCredentials: true });
                setSaved(res.data.saved || []);
            }catch(err){
                console.log(err);
            }
        };
        load();
    },[]);

    return (
        <div className='max-w-7xl mx-auto my-10'>
            <h1 className='font-bold text-xl mb-4'>Saved Jobs</h1>
            <div className='grid grid-cols-2 gap-4'>
                {saved.map((s)=> (
                    s.job && (
                        <div key={s._id} className='border rounded p-4 cursor-pointer' onClick={()=> navigate(`/description/${s.job._id}`)}>
                            <div className='font-semibold'>{s.job.title}</div>
                            <div className='text-sm text-gray-600'>{s.job.company?.name} • {s.job.location}</div>
                        </div>
                    )
                ))}
            </div>
        </div>
    )
}

export default SavedJobs

