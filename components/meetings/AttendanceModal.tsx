import { useState } from 'react';
import { X } from 'lucide-react';
import { useMeetingAttendance } from '@/hooks/useAttendance';
import type { Meeting } from '@/lib/types/meetings';

interface AttendanceModalProps {
    meeting: Meeting;
    onClose: () => void;
}

export default function AttendanceModal({ meeting, onClose }: AttendanceModalProps) {
    const { attendance, addAttendance } = useMeetingAttendance(meeting.id);
    const [userIds, setUserIds] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const user_ids = userIds
            .split(',')
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id));

        const success = await addAttendance({ user_ids });
        if (success) {
            setUserIds('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border border-[#222] rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">
                        Attendance - {meeting.title}
                    </h3>
                    <button onClick={onClose}>
                        <X className="h-5 w-5 text-[#aaa] hover:text-white" />
                    </button>
                </div>

                {/* Current Attendance */}
                <div className="mb-6">
                    <h4 className="text-white font-medium mb-3">Current Attendance</h4>
                    {attendance.length === 0 ? (
                        <p className="text-[#aaa] text-sm">No attendance recorded yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {attendance.map((att) => (
                                <div
                                    key={att.id}
                                    className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded"
                                >
                                    <span className="text-white">User #{att.user_id}</span>
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${att.attended
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                            }`}
                                    >
                                        {att.attended ? 'Present' : 'Absent'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mark Attendance Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#aaa] mb-2">
                            User IDs (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={userIds}
                            onChange={(e) => setUserIds(e.target.value)}
                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                            placeholder="1, 2, 3"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-all"
                    >
                        Mark Attendance
                    </button>
                </form>
            </div>
        </div>
    );
}
