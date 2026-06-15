import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Acumula logs hasta que Winston esté listo
  });

  // Reemplaza el logger interno de NestJS por Winston
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const config = app.get(ConfigService);

  // process.env.PORT tiene prioridad: Render lo inyecta automáticamente.
  // Si no existe (desarrollo local), cae al valor del .env, y si tampoco
  // existe ahí, usa 3001 como último recurso.
  const port = process.env.PORT ?? config.get<number>('port') ?? 3001;

  const frontendUrl =
    config.get<string>('frontendUrl') ?? 'http://localhost:3000';

  // CORS: permite llamadas desde el frontend
  app.enableCors({
    origin: frontendUrl,
    methods: ['GET', 'POST'],
  });

  // Prefijo global para todas las rutas: /api/anime, /api/character, etc.
  app.setGlobalPrefix('api');

  // '0.0.0.0' es obligatorio en Render: sin esto el servidor escucha
  // solo en localhost interno y Render no puede enrutarle tráfico externo.
  // En local no afecta en nada, funciona igual.
  await app.listen(port, '0.0.0.0');

  const env = process.env.NODE_ENV ?? 'development';
  console.log(`[${env}] Backend corriendo en el puerto ${port}`);
}

bootstrap().catch((err) => {
  console.error('Error al arrancar la aplicación:', err);
  process.exit(1);
});
