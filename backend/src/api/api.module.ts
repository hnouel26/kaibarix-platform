import { Module } from '@nestjs/common';
import { ContactController } from './contact/contact.controller.js';
import { ContactService } from './contact/contact.service.js';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
})
export class ApiModule {}
