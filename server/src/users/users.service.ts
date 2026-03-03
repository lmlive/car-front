import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findAll() {
    return this.userRepo.find({ order: { createdAt: 'DESC' } });
  }

  findOne(id: string) {
    return this.userRepo.findOne({ where: { id } });
  }

  async disable(id: string) {
    await this.userRepo.update(id, { status: 'disabled' });
    return { success: true };
  }

  async enable(id: string) {
    await this.userRepo.update(id, { status: 'active' });
    return { success: true };
  }
}
