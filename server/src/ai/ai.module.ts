import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { OpenAIController } from './openai.controller';

@Module({
  providers: [AiService],
  controllers: [AiController, OpenAIController],
  exports: [AiService],
})
export class AiModule {}
