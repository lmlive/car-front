"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const vehicle_entity_1 = require("../vehicles/vehicle.entity");
let AdminService = class AdminService {
    constructor(userRepo, vehicleRepo) {
        this.userRepo = userRepo;
        this.vehicleRepo = vehicleRepo;
    }
    getStats() {
        return Promise.all([
            this.userRepo.count(),
            this.vehicleRepo.count(),
        ]).then(([userCount, vehicleCount]) => ({
            userCount,
            vehicleCount,
        }));
    }
    getAllUsers() {
        return this.userRepo.find({ order: { createdAt: 'DESC' } });
    }
    getAllVehicles() {
        return this.vehicleRepo.find({
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
    }
    disableUser(id) {
        return this.userRepo.update(id, { status: 'disabled' });
    }
    enableUser(id) {
        return this.userRepo.update(id, { status: 'active' });
    }
    createVehicle(data) {
        const vehicle = this.vehicleRepo.create(data);
        return this.vehicleRepo.save(vehicle);
    }
    deleteVehicle(id) {
        return this.vehicleRepo.delete(id);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map