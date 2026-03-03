"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIController = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
let OpenAIController = class OpenAIController {
    constructor(ai) {
        this.ai = ai;
    }
    async chatCompletions(body, auth) {
        const apiKey = auth?.replace('Bearer ', '');
        if (apiKey && apiKey !== '1222') {
            return {
                id: 'chatcmpl-' + Date.now(),
                object: 'chat.completion',
                created: Math.floor(Date.now() / 1000),
                model: body.model || 'glm-4',
                choices: [
                    {
                        index: 0,
                        message: {
                            role: 'assistant',
                            content: 'API Key 无效，请检查配置。',
                        },
                        finish_reason: 'stop',
                    },
                ],
                usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
            };
        }
        const messages = body.messages || [];
        const userMessage = messages.find((m) => m.role === 'user');
        const systemMessage = messages.find((m) => m.role === 'system');
        let vehicleInfo = { brand: '未知', model: '未知', plateNumber: '未知', vin: '' };
        let symptom = userMessage?.content || '';
        if (systemMessage?.content?.includes('车辆信息')) {
            const match = systemMessage.content.match(/品牌[：:]([^\n]+)/);
            if (match)
                vehicleInfo.brand = match[1].trim();
            const modelMatch = systemMessage.content.match(/车型[：:]([^\n]+)/);
            if (modelMatch)
                vehicleInfo.model = modelMatch[1].trim();
            const plateMatch = systemMessage.content.match(/车牌[：:]([^\n]+)/);
            if (plateMatch)
                vehicleInfo.plateNumber = plateMatch[1].trim();
        }
        const result = await this.ai.diagnose(vehicleInfo, symptom);
        return {
            id: 'chatcmpl-' + Date.now(),
            object: 'chat.completion',
            created: Math.floor(Date.now() / 1000),
            model: body.model || 'glm-4',
            choices: [
                {
                    index: 0,
                    message: {
                        role: 'assistant',
                        content: result.diagnosis,
                    },
                    finish_reason: 'stop',
                },
            ],
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        };
    }
};
exports.OpenAIController = OpenAIController;
__decorate([
    (0, common_1.Post)('v1/chat/completions'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OpenAIController.prototype, "chatCompletions", null);
exports.OpenAIController = OpenAIController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], OpenAIController);
//# sourceMappingURL=openai.controller.js.map