import { Controller, Post, Body, Request } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private ai: AiService) {}

  @Post('diagnose')
  async diagnose(@Request() req: any, @Body() body: { vehicleId: string; symptom: string; vehicleInfo: any }) {
    return this.ai.diagnose(body.vehicleInfo, body.symptom);
  }
}
