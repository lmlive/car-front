import { AuthService } from './auth.service';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(body: {
        phone: string;
        password: string;
        nickname?: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            phone: string;
            nickname: string;
        };
    }>;
    login(body: {
        phone: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            phone: string;
            nickname: string;
        };
    }>;
    getProfile(req: any): Promise<import("../users/user.entity").User>;
}
