import '@aikidosec/firewall';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ZenGuard } from "./zen.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Acme Corporation')
    .setDescription('API used by Acme Corporation partners')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, 
    {
      jsonDocumentUrl: 'swagger/json'
    }
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new ZenGuard());
  app.enableCors({credentials: true, origin: ["https://sovulnerable.fly.dev", "https://sovulnerable.fly.dev.evil.com", "https://example.com"]})
  await app.listen(3000);
}
bootstrap();
