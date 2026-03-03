import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwt: JwtService,
  ) {}

  async register(phone: string, password: string, nickname?: string) {
    const exist = await this.userRepo.findOne({ where: { phone } });
    if (exist) throw new ConflictException('手机号已注册');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ phone, password: hashed, nickname });
    await this.userRepo.save(user);

    return this.generateToken(user);
  }

  async login(phone: string, password: string) {
    const user = await this.userRepo.findOne({ where: { phone } });
    if (!user) throw new UnauthorizedException('手机号或密码错误');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('手机号或密码错误');

    if (user.status === 'disabled') throw new UnauthorizedException('账号已被禁用');

    return this.generateToken(user);
  }

  async getProfile(userId: string) {
    return this.userRepo.findOne({ where: { id: userId } });
  }

  private generateToken(user: User) {
    const payload = { sub: user.id, phone: user.phone };
    return {
      access_token: this.jwt.sign(payload),
      user: { id: user.id, phone: user.phone, nickname: user.nickname },
    };
  }
}
