import { User } from '../users/user.entity';
export declare class Vehicle {
    id: string;
    userId: string;
    user: User;
    plateNumber: string;
    brand: string;
    model: string;
    vin: string;
    color: string;
    purchaseDate: string;
    createdAt: Date;
}
