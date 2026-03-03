export declare class AiService {
    private openai;
    constructor();
    diagnose(vehicleInfo: any, symptom: string): Promise<{
        diagnosis: string;
        timestamp: string;
    }>;
}
