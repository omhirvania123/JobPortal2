import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'

const ApplicantDrawer = ({ open, onClose, application }) => {
    const [note, setNote] = useState('');
    if(!application) return null;
    const addNote = async () => {
        if(!note.trim()) return;
        await axios.post(`${APPLICATION_API_END_POINT}/notes/${application._id}`, { text: note }, { withCredentials: true });
        setNote('');
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Candidate</DialogTitle>
                </DialogHeader>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <div className='font-semibold'>{application?.applicant?.fullname}</div>
                        <div className='text-sm text-gray-600'>{application?.applicant?.email}</div>
                        <div className='text-sm mt-2'>Stage: {application?.stage}</div>
                        {application?.interview?.scheduledAt && (
                            <div className='text-sm'>Interview: {new Date(application.interview.scheduledAt).toLocaleString()}</div>
                        )}
                        {application?.assessment?.url && (
                            <div className='text-sm'>Assessment: {application.assessment.url}</div>
                        )}
                    </div>
                    <div>
                        <div className='font-semibold mb-2'>Notes</div>
                        <textarea value={note} onChange={(e)=> setNote(e.target.value)} className='w-full border rounded p-2 h-24' placeholder='Add a private note...'/>
                        <div className='flex justify-end mt-2'>
                            <Button size="sm" onClick={addNote}>Add Note</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ApplicantDrawer

