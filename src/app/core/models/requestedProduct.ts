import { IDiscountTier } from "./discount-tier";

export interface IRequestedProduct {
  id: string;
  sku: string;
  supplier: {
    id: string;
    name: string;
    rating: number;
  };
  name: string;
  description: string;
  category: {
    main: string;
    sub: string;
    type: string;
  };
  price: {
    unit: number;
    currency: string;
    discountTiers: IDiscountTier[];
  };
  inventory: {
    stock: number;
    moq: number;
    unitType: string;
  };
  groupBuy: {
    isActive: boolean;
    currentQty: number;
    targetQty: number;
  };
  imageUrl: string[]; // <- service writes here
  specs: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    material: string;
  };
  logistics: {
    shippingClass: string;
    temperatureControl: string;
  };
  status: {
    isVerified: boolean;
    isActive: boolean;
    tags: string[];
  };
  createdAt: any;
  updatedAt: any;
  vote?: number;
}
