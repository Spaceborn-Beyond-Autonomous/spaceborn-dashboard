export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    is_read: boolean;
    created_at: string; // ISO timestamp
    user_id: number;
}