import { Controller, Post, Body, Headers, HttpCode } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller()
export class OpenAIController {
  constructor(private ai: AiService) {}

  @Post('v1/chat/completions')
  @HttpCode(200)
  async chatCompletions(
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
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
    const userMessage = messages.find((m: any) => m.role === 'user');
    const systemMessage = messages.find((m: any) => m.role === 'system');

    let vehicleInfo = { brand: '未知', model: '未知', plateNumber: '未知', vin: '' };
    let symptom = userMessage?.content || '';

    if (systemMessage?.content?.includes('车辆信息')) {
      const match = systemMessage.content.match(/品牌[：:]([^\n]+)/);
      if (match) vehicleInfo.brand = match[1].trim();
      const modelMatch = systemMessage.content.match(/车型[：:]([^\n]+)/);
      if (modelMatch) vehicleInfo.model = modelMatch[1].trim();
      const plateMatch = systemMessage.content.match(/车牌[：:]([^\n]+)/);
      if (plateMatch) vehicleInfo.plateNumber = plateMatch[1].trim();
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
}
