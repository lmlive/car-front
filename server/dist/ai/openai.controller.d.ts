import { AiService } from './ai.service';
export declare class OpenAIController {
    private ai;
    constructor(ai: AiService);
    chatCompletions(body: any, auth: string): Promise<{
        id: string;
        object: string;
        created: number;
        model: any;
        choices: {
            index: number;
            message: {
                role: string;
                content: string;
            };
            finish_reason: string;
        }[];
        usage: {
            prompt_tokens: number;
            completion_tokens: number;
            total_tokens: number;
        };
    }>;
}
