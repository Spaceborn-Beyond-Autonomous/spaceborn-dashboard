export interface Revenue {
    id: number;
    project_id: number;
    amount: number;
    date: string;
    description?: string;
    status: 'pending' | 'received' | 'overdue';
    created_at?: string;
    updated_at?: string;
}

export interface RevenueCreate {
    project_id: number;
    amount: number;
    date: string;
    description?: string;
    status: 'pending' | 'received' | 'overdue';
}

export interface RevenueUpdate {
    amount?: number;
    date?: string;
    description?: string;
    status?: 'pending' | 'received' | 'overdue';
}
