import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private userRepo;
    constructor(userRepo: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    disable(id: string): Promise<{
        success: boolean;
    }>;
    enable(id: string): Promise<{
        success: boolean;
    }>;
}
