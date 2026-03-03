import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
export declare class AdminService {
    private userRepo;
    private vehicleRepo;
    constructor(userRepo: Repository<User>, vehicleRepo: Repository<Vehicle>);
    getStats(): Promise<{
        userCount: number;
        vehicleCount: number;
    }>;
    getAllUsers(): Promise<User[]>;
    getAllVehicles(): Promise<Vehicle[]>;
    disableUser(id: string): Promise<import("typeorm").UpdateResult>;
    enableUser(id: string): Promise<import("typeorm").UpdateResult>;
    createVehicle(data: any): Promise<Vehicle[]>;
    deleteVehicle(id: string): Promise<import("typeorm").DeleteResult>;
}
