import { INotification } from "./notification";
import { IOrder } from "./order";
import { IProduct } from "./product";

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    businessName: string;
    email: string;
    businessPhoneNumber: string;
    personalPhoneNumber: string;
    addresses: [{
        id: string;
        government: string;
        city: string;
        street: string;
        building: string;
    }];
    paymentMethods?: [{
        id: string;
        cardNumber: string,
        securityCode: string,
        expiryDate: string
    }]
    avatarUrl?: string;
    role: 'user' | 'factory' | 'admin';
    subscribe?: boolean;
    products?: string[]; // Factory
    ordersList?: IOrder[]; // Factory & User
    rate?: number; // Factory
    wishListProducts?: string[]; // User
    cartProducts?: IProduct[]; // User
    notifications?: INotification[];
}
