import { Logger } from '@nestjs/common'
import helmet from 'helmet'

import { ConfigService } from './config'
import { corsMatcher } from './cors-matcher'
import { createApp } from './create-app'

async function prepareApp(bufferLogs = true) {
  const app = await createApp(bufferLogs)
  app.set('query parser', 'extended')
  app.use(helmet())

  const configService = app.get(ConfigService)
  app.enableCors({
    origin: (
      requestOrigin: string,
      callback: (error: Error | null, origin?: boolean) => void,
    ) => {
      if (process.env['NODE_ENV'] === 'development') {
        return callback(null, false)
      }
      callback(
        null,
        configService
          .get('allow-origin')
          .some((allowedOrigin) => corsMatcher(requestOrigin, allowedOrigin)),
      )
    },
  })

  return app
}

async function bootstrap() {
  const app = await prepareApp()
  const configService = app.get(ConfigService)
  const port = configService.get('port')
  const addr = configService.get('listen')

  await app.listen(port, addr)
  Logger.debug('Application started', { appURL: await app.getUrl() })
}

bootstrap()
  .then(() => {
    Logger.debug('Application stopped')
  })
  .catch((error: Error) => {
    console.error('Application crashed', { error })
  })
