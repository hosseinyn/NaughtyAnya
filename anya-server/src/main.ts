import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiTokenMiddleware } from './api-token.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new ApiTokenMiddleware().use);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
