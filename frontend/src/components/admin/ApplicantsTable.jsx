import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar, Check, MoreHorizontal, Trash2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const dispatch = useDispatch();

    const statusHandler = async (status, id) => {
        console.log('called');
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            console.log(res);
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const removeApplicant = async (id) => {
        if(!confirm('Remove this applicant?')) return;
        try{
            const res = await axios.delete(`${APPLICATION_API_END_POINT}/delete/${id}`, { withCredentials: true });
            if(res.data.success){
                toast.success(res.data.message);
                // Optimistically remove from UI
                dispatch({ type:'application/removeApplicantById', payload:id });
            }
        }catch(e){
            toast.error(e?.response?.data?.message || 'Failed');
        }
    }

    const shortlist = async (id) => {
        try{
            const res = await axios.post(`${APPLICATION_API_END_POINT}/shortlist/${id}`, {}, { withCredentials: true });
            if(res.data.success){ toast.success(res.data.message); }
        }catch(e){ toast.error(e?.response?.data?.message || 'Failed'); }
    }

    const scheduleInterview = async (id) => {
        const scheduledAt = prompt('Enter interview datetime (YYYY-MM-DDTHH:mm)');
        if(!scheduledAt) return;
        const mode = 'online';
        const meetLink = prompt('Meet link (or leave empty)') || '';
        const location = '';
        try{
            const res = await axios.post(`${APPLICATION_API_END_POINT}/schedule-interview/${id}`, { scheduledAt, mode, meetLink, location }, { withCredentials: true });
            if(res.data.success){ toast.success(res.data.message); }
        }catch(e){ toast.error(e?.response?.data?.message || 'Failed'); }
    }

    const offer = async (id) => {
        try{
            const res = await axios.post(`${APPLICATION_API_END_POINT}/decision/${id}`, { decision:'offer' }, { withCredentials: true });
            if(res.data.success){ toast.success(res.data.message); }
        }catch(e){ toast.error(e?.response?.data?.message || 'Failed'); }
    }

    const reject = async (id) => {
        try{
            const res = await axios.post(`${APPLICATION_API_END_POINT}/decision/${id}`, { decision:'rejected' }, { withCredentials: true });
            if(res.data.success){ toast.success(res.data.message); }
        }catch(e){ toast.error(e?.response?.data?.message || 'Failed'); }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <tr key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell >
                                    {
                                        item.applicant?.profile?.resume ? <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a> : <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            <div onClick={()=> shortlist(item?._id)} className='flex w-fit items-center my-2 cursor-pointer'>
                                                <Check className='w-4 mr-2'/> Shortlist
                                            </div>
                                            <div onClick={()=> scheduleInterview(item?._id)} className='flex w-fit items-center my-2 cursor-pointer'>
                                                <Calendar className='w-4 mr-2'/> Schedule Interview
                                            </div>
                                            <div onClick={()=> offer(item?._id)} className='flex w-fit items-center my-2 cursor-pointer'>
                                                <Check className='w-4 mr-2'/> Offer
                                            </div>
                                            <div onClick={()=> reject(item?._id)} className='flex w-fit items-center my-2 cursor-pointer'>
                                                <X className='w-4 mr-2'/> Reject
                                            </div>
                                            <div onClick={()=> removeApplicant(item?._id)} className='flex w-fit items-center my-2 cursor-pointer text-red-600'>
                                                <Trash2 className='w-4 mr-2'/> Remove
                                            </div>
                                        </PopoverContent>
                                    </Popover>

                                </TableCell>

                            </tr>
                        ))
                    }

                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable