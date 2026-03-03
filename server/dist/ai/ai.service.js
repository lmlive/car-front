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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
let AiService = class AiService {
    constructor() {
        this.openai = null;
        const apiKey = process.env.OPENAI_API_KEY;
        if (apiKey && apiKey.startsWith('sk-')) {
            this.openai = new openai_1.OpenAI({ apiKey });
        }
    }
    async diagnose(vehicleInfo, symptom) {
        if (!this.openai) {
            return {
                diagnosis: 'AI诊断服务未配置。请联系管理员配置OpenAI API Key。\n\n在等待期间，建议您：\n1. 描述更详细的故障现象\n2. 检查车辆是否有明显的异常声响或报警灯\n3. 如有安全问题，请直接前往专业维修店检查',
                timestamp: new Date().toISOString(),
            };
        }
        const prompt = `你是一个专业的汽车维修技师。请根据以下车辆信息和故障现象，提供专业的诊断建议。

车辆信息：
- 品牌：${vehicleInfo.brand}
- 车型：${vehicleInfo.model}
- 车牌：${vehicleInfo.plateNumber}
${vehicleInfo.vin ? `- 车架号：${vehicleInfo.vin}` : ''}

故障现象：${symptom}

请提供：
1. 可能的原因分析
2. 建议的检查步骤
3. 初步处理方案
4. 是否需要立即就医（指专业维修）

注意：如果涉及安全气囊、刹车系统等安全相关问题，请特别提醒及时到专业维修点检查。`;
        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: '你是一个专业、友好的汽车维修助手。' },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
            });
            return {
                diagnosis: completion.choices[0].message.content,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                diagnosis: '抱歉，AI诊断服务暂时不可用。请联系专业维修人员。\n\n错误信息：' + error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AiService);
//# sourceMappingURL=ai.service.js.map