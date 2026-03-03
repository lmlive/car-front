import { Vehicle } from '../vehicles/vehicle.entity';
export declare class User {
    id: string;
    phone: string;
    password: string;
    nickname: string;
    status: string;
    createdAt: Date;
    vehicles: Vehicle[];
}
