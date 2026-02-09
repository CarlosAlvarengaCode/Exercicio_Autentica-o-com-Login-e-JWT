import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  const usersService = app.get(UsersService);

 const config = new DocumentBuilder()
    .setTitle('Clean Architecture')
    .setDescription('Em desenvolvimento')
    .setVersion('1.0')
    .build();
    const customOptions: ExpressSwaggerCustomOptions = {
    customSiteTitle: 'Clean Architecture',
    customCss: `
      .swagger-ui section.models{display: none};`,
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, customOptions);
  await app.listen(3000);
  console.log('Aplicação rodando em http://localhost:3000');
}
bootstrap();
interface ExpressSwaggerCustomOptions {
  explorer?: boolean;
  swaggerOptions?: Record<string, any>;
  customCss?: string;
  customCssUrl?: string;
  customJs?: string;
  customfavIcon?: string;
  swaggerUrl?: string;
  customSiteTitle?: string;
  operationsSorter?: string;
  url?: string;
  urls?: Record<'url' | 'name', string>[];
}