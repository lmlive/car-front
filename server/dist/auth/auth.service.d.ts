import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
export declare class AuthService {
    private userRepo;
    private jwt;
    constructor(userRepo: Repository<User>, jwt: JwtService);
    register(phone: string, password: string, nickname?: string): Promise<{
        access_token: string;
        user: {
            id: string;
            phone: string;
            nickname: string;
        };
    }>;
    login(phone: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            phone: string;
            nickname: string;
        };
    }>;
    getProfile(userId: string): Promise<User>;
    private generateToken;
}
