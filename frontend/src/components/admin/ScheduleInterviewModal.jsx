import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

const ScheduleInterviewModal = ({ open, onClose, onSubmit }) => {
    const [datetime, setDatetime] = useState('');
    const [mode, setMode] = useState('online');
    const [meetLink, setMeetLink] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!datetime) return;
        onSubmit({ scheduledAt: datetime, mode, meetLink, location });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Schedule Interview</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='space-y-3'>
                    <div>
                        <Label>Date & Time</Label>
                        <Input type="datetime-local" value={datetime} onChange={(e)=> setDatetime(e.target.value)} />
                    </div>
                    <div>
                        <Label>Mode</Label>
                        <select value={mode} onChange={(e)=> setMode(e.target.value)} className='w-full border rounded h-10 px-3'>
                            <option value="online">Online</option>
                            <option value="onsite">On-site</option>
                        </select>
                    </div>
                    {mode === 'online' ? (
                        <div>
                            <Label>Meet Link</Label>
                            <Input placeholder="https://meet..." value={meetLink} onChange={(e)=> setMeetLink(e.target.value)} />
                        </div>
                    ) : (
                        <div>
                            <Label>Location</Label>
                            <Input placeholder="Office address" value={location} onChange={(e)=> setLocation(e.target.value)} />
                        </div>
                    )}
                    <div className='flex justify-end gap-2 pt-2'>
                        <Button type="button" variant="outline" onClick={()=> onClose(false)}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ScheduleInterviewModal

