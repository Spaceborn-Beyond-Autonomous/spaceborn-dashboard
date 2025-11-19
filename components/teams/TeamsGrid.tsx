'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/api/users';
import { listTeams, updateTeam, deleteTeam } from '@/lib/api/teams';
import { listUsers } from '@/lib/api/users';
import { User } from '@/lib/types/users';
import { Team } from '@/lib/types/teams';
import TeamCard from './TeamCard';
import TeamCardSkeleton from './TeamCardSkeleton';
import EmptyTeamsState from './EmptyTeamsState';
import CreateTeamModal from './CreateTeamModal';
import EditTeamModal from './EditTeamModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { AlertCircle, Plus } from 'lucide-react';

type LoadingState = 'idle' | 'loading' | 'refreshing' | 'error';

export default function TeamsGrid() {
    const [user, setUser] = useState<User | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loadingState, setLoadingState] = useState<LoadingState>('loading');
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const fetchInitialData = useCallback(async () => {
        try {
            setLoadingState('loading');
            setError(null);

            const userData = await getCurrentUser();

            if (!['admin', 'core'].includes(userData.role)) {
                router.push('/dashboard');
                return;
            }

            setUser(userData);

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
            setLoadingState('idle');
        }
    }, [user, loadingState]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        if (!user || loadingState === 'loading') return;

        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData, user, loadingState]);

    const handleTeamCreated = () => {
        setIsCreateModalOpen(false);
        fetchData();
    };

    const handleEditTeam = (team: Team) => {
        setSelectedTeam(team);
        setIsEditModalOpen(true);
    };

    const handleUpdateTeam = async (updatedData: Partial<Team>) => {
        if (!selectedTeam) return;

        try {
            await updateTeam(selectedTeam.id, updatedData);
            setTeams(teams.map(t =>
                t.id === selectedTeam.id
                    ? { ...t, ...updatedData }
                    : t
            ));
            setIsEditModalOpen(false);
            setSelectedTeam(null);
        } catch (err) {
            throw err;
        }
    };

    const handleDeleteTeam = (team: Team) => {
        setSelectedTeam(team);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedTeam) return;

        setIsDeleting(true);
        try {
            await deleteTeam(selectedTeam.id);
            setTeams(teams.filter(t => t.id !== selectedTeam.id));
            setIsDeleteModalOpen(false);
            setSelectedTeam(null);
        } catch (err) {
            console.error('Failed to delete team:', err);
            alert('Failed to delete team. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (loadingState === 'loading') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <TeamCardSkeleton key={i} />
                ))}
            </div>
        );
    }

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

    if (!user) {
        return null;
    }

    if (teams.length === 0) {
        return (
            <>
                <EmptyTeamsState onAddTeam={() => setIsCreateModalOpen(true)} />
                <CreateTeamModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={handleTeamCreated}
                    users={users}
                />
            </>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Teams</h1>
                    <p className="text-sm text-[#aaa] mt-1">
                        {teams.length} team{teams.length !== 1 ? 's' : ''} total
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors font-medium"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Team</span>
                </button>
            </div>

            {loadingState === 'refreshing' && (
                <div className="flex items-center justify-center gap-2 text-sm text-[#aaa] py-2">
                    <div className="w-4 h-4 border-2 border-[#aaa] border-t-white rounded-full animate-spin" />
                    <span>Updating...</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <TeamCard
                        key={team.id}
                        team={team}
                        users={users}
                        onEdit={handleEditTeam}
                        onDelete={handleDeleteTeam}
                    />
                ))}
            </div>

            <CreateTeamModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleTeamCreated}
                users={users}
            />

            {selectedTeam && (
                <>
                    <EditTeamModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setSelectedTeam(null);
                        }}
                        onSuccess={handleUpdateTeam}
                        team={selectedTeam}
                        users={users}
                    />

                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => {
                            setIsDeleteModalOpen(false);
                            setSelectedTeam(null);
                        }}
                        onConfirm={handleConfirmDelete}
                        teamName={selectedTeam.name}
                        isDeleting={isDeleting}
                    />
                </>
            )}
        </div>
    );
}
