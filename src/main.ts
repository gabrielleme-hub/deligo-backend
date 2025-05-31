import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('DeliGo API')
    .setDescription('API do sistema de delivery DeliGo')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Habilita validação global
  app.useGlobalPipes(new ValidationPipe());
  
  // Habilita CORS
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
