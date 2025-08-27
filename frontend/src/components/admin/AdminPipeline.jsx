import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { useParams, useNavigate } from 'react-router-dom'
import ScheduleInterviewModal from './ScheduleInterviewModal'
import ApplicantDrawer from './ApplicantDrawer'

const columns = [
    { key: 'pending', title: 'Pending' },
    { key: 'shortlisted', title: 'Shortlisted' },
    { key: 'interview_scheduled', title: 'Interview Scheduled' },
    { key: 'hired', title: 'Hired' },
    { key: 'rejected', title: 'Rejected' }
];

const Card = ({ item, onAction, onOpen }) => {
    return (
        <div className='border rounded-lg p-3 bg-white shadow-sm mb-3 hover:shadow-md transition-shadow w-full'>
            <div className='font-medium cursor-pointer leading-tight' onClick={()=> onOpen(item)}>{item?.applicant?.fullname}</div>
            <div className='text-xs text-gray-600'>{item?.applicant?.email}</div>
            {item?.interview?.scheduledAt && (
                <div className='text-xs mt-1 break-words'>Interview: {new Date(item.interview.scheduledAt).toLocaleString()}</div>
            )}
            <div className='flex flex-wrap gap-2 mt-2'>
                {item.stage === 'pending' && (
                    <>
                        <button onClick={()=> onAction('shortlist', item)} className='text-xs px-2 py-1 border rounded'>Shortlist</button>
                        <button onClick={()=> onAction('reject', item)} className='text-xs px-2 py-1 border rounded'>Reject</button>
                    </>
                )}
                {item.stage === 'shortlisted' && (
                    <>
                        <button onClick={()=> onAction('schedule', item)} className='text-xs px-2 py-1 border rounded'>Schedule</button>
                        <button onClick={()=> onAction('reject', item)} className='text-xs px-2 py-1 border rounded'>Reject</button>
                    </>
                )}
                {item.stage === 'interview_scheduled' && (
                    <>
                        <button onClick={()=> onAction('hire', item)} className='text-xs px-2 py-1 border rounded'>Hire</button>
                        <button onClick={()=> onAction('reject', item)} className='text-xs px-2 py-1 border rounded'>Reject</button>
                    </>
                )}
            </div>
        </div>
    )
}

const AdminPipeline = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [scheduleFor, setScheduleFor] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(null);

    useEffect(()=>{
        const load = async ()=>{
            try{
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                const job = res.data.job;
                const groups = {};
                for(const c of columns){ groups[c.key] = []; }
                for(const a of job.applications){
                    const key = a.stage || 'pending';
                    if(!groups[key]) groups[key] = [];
                    groups[key].push(a);
                }
                setData(groups);
            }catch(e){ console.log(e); }
        }
        load();
    },[params.id]);

    const onAction = async (action, item) => {
        try{
            if(action === 'shortlist'){
                await axios.post(`${APPLICATION_API_END_POINT}/shortlist/${item._id}`, {}, { withCredentials: true });
            }
            if(action === 'schedule'){
                setScheduleFor(item);
                return;
            }
            if(action === 'reject'){
                await axios.post(`${APPLICATION_API_END_POINT}/decision/${item._id}`, { decision:'rejected' }, { withCredentials: true });
            }
            if(action === 'hire'){
                await axios.post(`${APPLICATION_API_END_POINT}/decision/${item._id}`, { decision:'hired' }, { withCredentials: true });
            }
            // reload
            const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
            const job = res.data.job;
            const groups = {};
            for(const c of columns){ groups[c.key] = []; }
            for(const a of job.applications){
                const key = a.stage || 'pending';
                if(!groups[key]) groups[key] = [];
                groups[key].push(a);
            }
            setData(groups);
        }catch(e){ console.log(e); }
    }

    const onSubmitSchedule = async ({ scheduledAt, mode, meetLink, location }) => {
        if(!scheduleFor) return;
        try{
            await axios.post(`${APPLICATION_API_END_POINT}/schedule-interview/${scheduleFor._id}`, { scheduledAt, mode, meetLink, location }, { withCredentials: true });
        }finally{
            setScheduleFor(null);
            // refresh
            const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
            const job = res.data.job;
            const groups = {};
            for(const c of columns){ groups[c.key] = []; }
            for(const a of job.applications){
                const key = a.stage || 'pending';
                if(!groups[key]) groups[key] = [];
                groups[key].push(a);
            }
            setData(groups);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-6'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-bold text-xl'>Pipeline</h1>
                    <button onClick={()=> navigate(-1)} className='text-sm underline'>Back</button>
                </div>
                <div className='grid grid-cols-7 gap-4 mt-4'>
                    {columns.map(col => (
                        <div key={col.key} className='bg-gray-50 border rounded p-3 min-h-[300px]'>
                            <div className='font-semibold mb-2 sticky top-0 bg-gray-50'>{col.title}</div>
                            {(data[col.key] || []).map(a => (
                                <Card key={a._id} item={a} onAction={onAction} onOpen={setOpenDrawer} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <ScheduleInterviewModal open={!!scheduleFor} onClose={()=> setScheduleFor(null)} onSubmit={onSubmitSchedule} />
            <ApplicantDrawer open={!!openDrawer} onClose={()=> setOpenDrawer(null)} application={openDrawer} />
        </div>
    )
}

export default AdminPipeline

