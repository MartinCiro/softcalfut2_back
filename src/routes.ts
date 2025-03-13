import { Module } from '@nestjs/common';
import { UsuarioModule } from 'api/usuarios/usuario.module';
import { AuthModule } from 'api/auth/auth.module';
import { AppController } from 'src/app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/api-docs'
    }),
    UsuarioModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
