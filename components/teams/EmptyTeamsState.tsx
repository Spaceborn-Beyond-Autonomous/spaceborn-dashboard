import { Users as UsersIcon } from 'lucide-react';

export default function EmptyTeamsState() {
    return (
        <main className="p-6">
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <UsersIcon className="h-16 w-16 text-[#aaa] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Teams Found</h3>
                    <p className="text-[#aaa]">There are no teams available at the moment.</p>
                </div>
            </div>
        </main>
    );
}
