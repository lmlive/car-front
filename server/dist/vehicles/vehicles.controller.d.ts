import { VehiclesService } from './vehicles.service';
export declare class VehiclesController {
    private vehicles;
    constructor(vehicles: VehiclesService);
    findByUser(req: any): Promise<import("./vehicle.entity").Vehicle[]>;
    findOne(id: string): Promise<import("./vehicle.entity").Vehicle>;
    create(req: any, body: any): Promise<import("./vehicle.entity").Vehicle>;
    update(id: string, body: any): Promise<import("typeorm").UpdateResult>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
}
