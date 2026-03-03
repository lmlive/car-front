import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepo: Repository<Vehicle>,
  ) {}

  findByUser(userId: string) {
    return this.vehicleRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  findAll() {
    return this.vehicleRepo.find({ 
      relations: ['user'],
      order: { createdAt: 'DESC' } 
    });
  }

  findOne(id: string) {
    return this.vehicleRepo.findOne({ where: { id }, relations: ['user'] });
  }

  create(userId: string, data: Partial<Vehicle>) {
    const vehicle = this.vehicleRepo.create({ ...data, userId });
    return this.vehicleRepo.save(vehicle);
  }

  update(id: string, data: Partial<Vehicle>) {
    return this.vehicleRepo.update(id, data);
  }

  delete(id: string) {
    return this.vehicleRepo.delete(id);
  }
}
