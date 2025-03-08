import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { version } from '../package.json'

import { AppModule } from './app'

export async function createApp(bufferLogs = true) {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs,
    bodyParser: true,
    logger: ['error', 'warn', 'log', 'debug', 'verbose', 'fatal'],
  })
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Books backend')
    .setDescription('Books backend API description')
    .setVersion(version)
    .addTag('books')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, documentFactory)

  return app
}
