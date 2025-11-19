import type { UserAttendanceCount } from '@/lib/types/meetings';

interface AttendanceOverviewProps {
    attendanceCounts: UserAttendanceCount[];
}

export default function AttendanceOverview({ attendanceCounts }: AttendanceOverviewProps) {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Attendance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendanceCounts.slice(0, 6).map((count) => (
                    <div key={count.user_id} className="bg-[#111] border border-[#222] rounded p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">{count.username}</p>
                                <p className="text-[#aaa] text-sm">{count.email}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-white">{count.meetings_joined}</p>
                                <p className="text-[#aaa] text-xs">meetings</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
