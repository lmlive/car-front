import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
export declare class VehiclesService {
    private vehicleRepo;
    constructor(vehicleRepo: Repository<Vehicle>);
    findByUser(userId: string): Promise<Vehicle[]>;
    findAll(): Promise<Vehicle[]>;
    findOne(id: string): Promise<Vehicle>;
    create(userId: string, data: Partial<Vehicle>): Promise<Vehicle>;
    update(id: string, data: Partial<Vehicle>): Promise<import("typeorm").UpdateResult>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
}
