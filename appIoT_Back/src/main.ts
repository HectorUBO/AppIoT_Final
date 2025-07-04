import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true
  });

  const config = new DocumentBuilder()
    .setTitle('API app IoT')
    .setDescription('Documentación de la API para el sistema de monitoreo agrícola')
    .setVersion('1.0')
    .addTag('users')
    .addTag('plots')
    .addTag('plot-data')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();