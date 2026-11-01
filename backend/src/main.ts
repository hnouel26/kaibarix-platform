import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'https://frontend-6vcw8ds8g-hnouel26.vercel.app'],
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
