import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Vehicle } from '../vehicles/vehicle.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Vehicle)
    private vehicleRepo: Repository<Vehicle>,
  ) {}

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

  disableUser(id: string) {
    return this.userRepo.update(id, { status: 'disabled' });
  }

  enableUser(id: string) {
    return this.userRepo.update(id, { status: 'active' });
  }

  createVehicle(data: any) {
    const vehicle = this.vehicleRepo.create(data);
    return this.vehicleRepo.save(vehicle);
  }

  deleteVehicle(id: string) {
    return this.vehicleRepo.delete(id);
  }
}
