export type Notification = {
    id: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
    sender: {
        id: string;
        username: string;
        image: string;
    };
}

export interface NotificationDropdownProps {
    notifications: Notification[];
}