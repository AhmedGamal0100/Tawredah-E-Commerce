import { IProduct } from "./product";
import { IUser } from "./user";

export interface IOrder {
    id: string;
    from: string;
    to: string[];
    price: {
        subtotal: number;
        shipping: number;
        total: number;
    };
    dueDate: any;
    items: number;
    status: "Review" | "Production" | "Shipping" | "Done" | "Pending" | "Failed";
    orderProducts: IProduct[];
    paymentMethod: "Cash on Delivery" | "Credit Card";
    shippingDetails?: {
        name: string,
        address: string,
        city: string,
        postalCode: string,
        phone: string,
    },
    paymentDetails?: {
        cardNumber: string,
        cardName: string,
        expiry: string,
        cvv: string,
    }
}
