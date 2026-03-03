import { AiService } from './ai.service';
export declare class AiController {
    private ai;
    constructor(ai: AiService);
    diagnose(req: any, body: {
        vehicleId: string;
        symptom: string;
        vehicleInfo: any;
    }): Promise<{
        diagnosis: string;
        timestamp: string;
    }>;
}
