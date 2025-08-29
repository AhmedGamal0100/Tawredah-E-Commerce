import { IDiscountTier } from "./discount-tier";

export interface INotification {
    message: string;
    type: 'error' | 'success' | 'info' | 'warning';
    createdAt: string;
    read: boolean;
    sourceType?: string;
    sourceId?: string;
    route?: string;
    id: string;
}
