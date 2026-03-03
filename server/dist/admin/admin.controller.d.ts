import { AdminService } from './admin.service';
export declare class AdminController {
    private admin;
    constructor(admin: AdminService);
    getStats(): Promise<{
        userCount: number;
        vehicleCount: number;
    }>;
    getAllUsers(): Promise<import("../users/user.entity").User[]>;
    disableUser(id: string): Promise<import("typeorm").UpdateResult>;
    enableUser(id: string): Promise<import("typeorm").UpdateResult>;
    getAllVehicles(): Promise<import("../vehicles/vehicle.entity").Vehicle[]>;
    createVehicle(body: any): Promise<import("../vehicles/vehicle.entity").Vehicle[]>;
    deleteVehicle(id: string): Promise<import("typeorm").DeleteResult>;
}
