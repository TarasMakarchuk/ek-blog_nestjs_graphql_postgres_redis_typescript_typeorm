import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {graphqlUploadExpress} from "graphql-upload";
import {NestExpressApplication} from "@nestjs/platform-express";
import {Logger} from "@nestjs/common";

const PORT = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.use(graphqlUploadExpress());

  await app.listen(PORT, () => Logger.log(`\x1b[34m Server started on http://${process.env.TYPEORM_HOST}:${PORT}`));
}

bootstrap();
