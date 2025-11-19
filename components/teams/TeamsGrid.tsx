'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/api/users';
import { listTeams } from '@/lib/api/teams';
import { listUsers } from '@/lib/api/users';
import { User } from '@/lib/types/users';
import { Team } from '@/lib/types/teams';
import TeamCard from './TeamCard';
import TeamCardSkeleton from './TeamCardSkeleton';
import EmptyTeamsState from './EmptyTeamsState';
import CreateTeamModal from './CreateTeamModal';
import { AlertCircle, Plus } from 'lucide-react';

type LoadingState = 'idle' | 'loading' | 'refreshing' | 'error';

export default function TeamsGrid() {
    const [user, setUser] = useState<User | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loadingState, setLoadingState] = useState<LoadingState>('loading');
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const fetchInitialData = useCallback(async () => {
        try {
            setLoadingState('loading');
            setError(null);

            // Authentication check
            const userData = await getCurrentUser();

            // Authorization check
            if (!['admin', 'core'].includes(userData.role)) {
                router.push('/dashboard');
                return;
            }

            setUser(userData);

            // Parallel data fetching
            const [teamsData, usersData] = await Promise.all([
                listTeams(),
                listUsers(),
            ]);

            setTeams(teamsData);
            setUsers(usersData);
            setLoadingState('idle');
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError(err instanceof Error ? err.message : 'Failed to load data');
            setLoadingState('error');

            // Redirect to login on authentication failure
            setTimeout(() => router.push('/login'), 2000);
        }
    }, [router]);

    const fetchData = useCallback(async () => {
        if (!user || loadingState === 'refreshing') return;

        try {
            setLoadingState('refreshing');
            const [teamsData, usersData] = await Promise.all([
                listTeams(),
                listUsers(),
            ]);
            setTeams(teamsData);
            setUsers(usersData);
            setLoadingState('idle');
        } catch (err) {
            console.error('Failed to refresh data:', err);
            // Don't show error on background refresh failure
            setLoadingState('idle');
        }
    }, [user, loadingState]);

    // Initial load
    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    // Polling
    useEffect(() => {
        if (!user || loadingState === 'loading') return;

        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData, user, loadingState]);

    const handleTeamCreated = () => {
        setIsModalOpen(false);
        fetchData(); // Refresh teams list
    };

    // Loading state
    if (loadingState === 'loading') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <TeamCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    // Error state
    if (loadingState === 'error') {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Error Loading Teams</h3>
                    <p className="text-[#aaa] mb-4">{error}</p>
                    <button
                        onClick={fetchInitialData}
                        className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return null;
    }

    // Empty state
    if (teams.length === 0) {
        return (
            <>
                <EmptyTeamsState onAddTeam={() => setIsModalOpen(true)} />
                <CreateTeamModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleTeamCreated}
                    users={users}
                />
            </>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Add Team Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Teams</h1>
                    <p className="text-sm text-[#aaa] mt-1">
                        {teams.length} team{teams.length !== 1 ? 's' : ''} total
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors font-medium"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Team</span>
                </button>
            </div>

            {/* Refresh indicator */}
            {loadingState === 'refreshing' && (
                <div className="flex items-center justify-center gap-2 text-sm text-[#aaa] py-2">
                    <div className="w-4 h-4 border-2 border-[#aaa] border-t-white rounded-full animate-spin" />
                    <span>Updating...</span>
                </div>
            )}

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <TeamCard key={team.id} team={team} users={users} />
                ))}
            </div>

            {/* Create Team Modal */}
            <CreateTeamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleTeamCreated}
                users={users}
            />
        </div>
    );
}
