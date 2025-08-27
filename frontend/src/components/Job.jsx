import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { SAVED_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const Job = ({job}) => {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        try{
            setSaving(true);
            await axios.post(`${SAVED_API_END_POINT}/save`, { jobId: job?._id }, { withCredentials: true });
            setSaved(true);
            toast.success('Job saved');
        }catch(err){
            const message = err?.response?.data?.message || 'Failed to save job';
            toast.error(message);
            if(err?.response?.status === 401){
                navigate('/login');
            }
        }finally{
            setSaving(false);
        }
    }

    useEffect(()=>{
        const checkSaved = async ()=>{
            try{
                const res = await axios.get(`${SAVED_API_END_POINT}/is-saved/${job?._id}`, { withCredentials: true });
                setSaved(!!res.data.saved);
            }catch(e){
                // ignore
            }
        }
        if(job?._id){
            checkSaved();
        }
    }, [job?._id]);
    // const jobId = "lsekdhjgdsnfvsdkjf";

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }
    
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button onClick={saved ? null : handleSave} disabled={saved || saving} variant="outline" className={`rounded-full ${saved ? 'opacity-60 cursor-not-allowed' : ''}`} size="icon">
                    <Bookmark className={`${saved ? 'text-[#7209b7]' : ''}`} />
                </Button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={()=> navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
                <Button onClick={saved ? null : handleSave} disabled={saving || saved} className={`bg-[#7209b7] ${saved ? 'opacity-60 cursor-not-allowed' : ''}`}>{saved ? 'Saved' : (saving ? 'Saving...' : 'Save For Later')}</Button>
            </div>
        </div>
    )
}

export default Job