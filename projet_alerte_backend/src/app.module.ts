import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FormAlerteModule } from './form_alerte/form_alerte.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: '192.168.1.189',
      port: 1521,
      username: 'C##users',
      password: 'devfuture1@',
      serviceName: 'xe',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
    }),
    AuthModule,
    UsersModule,
    FormAlerteModule,
  ],
})
export class AppModule {}
