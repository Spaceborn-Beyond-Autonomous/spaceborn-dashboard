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
import TeamDetailsModal from './TeamDetailsModal'; // Import new modal
import { AlertCircle, Plus, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type LoadingState = 'idle' | 'loading' | 'refreshing' | 'error';

export default function TeamsGrid() {
    const [user, setUser] = useState<User | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loadingState, setLoadingState] = useState<LoadingState>('loading');
    const [error, setError] = useState<string | null>(null);

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false); // New State

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
        toast.success("Team created successfully");
    };

    // Handler for viewing team details
    const handleViewTeam = (team: Team) => {
        setSelectedTeam(team);
        setIsViewModalOpen(true);
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
            toast.success("Team updated successfully");
        } catch (err) {
            toast.error("Failed to update team");
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
            toast.success("Team deleted successfully");
        } catch (err) {
            console.error('Failed to delete team:', err);
            toast.error("Failed to delete team");
        } finally {
            setIsDeleting(false);
        }
    };

    // --- Render States ---

    if (loadingState === 'loading') {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 bg-zinc-800 rounded-xl" />
                    <div className="space-y-2">
                        <div className="h-6 w-32 bg-zinc-800 rounded" />
                        <div className="h-4 w-48 bg-zinc-800 rounded" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <TeamCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (loadingState === 'error') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 animate-in fade-in duration-500">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-zinc-100 mb-2">Unable to Load Teams</h3>
                <p className="text-zinc-500 mb-6 text-center max-w-md">{error}</p>
                <button
                    onClick={fetchInitialData}
                    className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-lg font-medium transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!user) return null;

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
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl shadow-sm">
                        <Users className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Teams</h1>
                            {loadingState === 'refreshing' && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-[10px] text-zinc-500 animate-pulse">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    <span>Syncing...</span>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-zinc-500">
                            {teams.length} team{teams.length !== 1 ? 's' : ''} active in your workspace
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="group inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95"
                >
                    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                    <span>Create Team</span>
                </button>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <TeamCard
                        key={team.id}
                        team={team}
                        users={users}
                        onClick={handleViewTeam} // Pass view handler
                        onEdit={handleEditTeam}
                        onDelete={handleDeleteTeam}
                    />
                ))}
            </div>

            {/* Modals */}
            <CreateTeamModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleTeamCreated}
                users={users}
            />

            {selectedTeam && (
                <>
                    {/* View Details Modal */}
                    <TeamDetailsModal
                        isOpen={isViewModalOpen}
                        onClose={() => {
                            setIsViewModalOpen(false);
                            setSelectedTeam(null);
                        }}
                        team={selectedTeam}
                        users={users}
                    />

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