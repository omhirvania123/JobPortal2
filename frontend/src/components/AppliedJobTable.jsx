import React from 'react'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead className="text-right">Interview</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? <span>You haven't applied any job yet.</span> : allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id}>
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{appliedJob.job?.title}</TableCell>
                                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                                <TableCell>
                                    <div className='text-sm'>
                                        {appliedJob?.stage?.replaceAll('_',' ') || 'pending'}
                                        {appliedJob?.assessment?.url && (
                                            <div className='text-xs text-gray-600'>Assessment: {appliedJob.assessment.url}</div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    {appliedJob?.interview?.scheduledAt ? (
                                        <div className='text-right text-sm'>
                                            <div>{new Date(appliedJob.interview.scheduledAt).toLocaleString()}</div>
                                            {appliedJob?.interview?.meetLink && (
                                                <a className='text-blue-600 underline' href={appliedJob.interview.meetLink} target='_blank' rel='noreferrer'>Join link</a>
                                            )}
                                        </div>
                                    ) : (
                                        <span className='text-xs text-gray-500'>Not scheduled</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable