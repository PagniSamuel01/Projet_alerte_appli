import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UsersService);
  
  const users = await userService.findAll();
  console.log('--- USERS START ---');
  users.forEach(u => {
    console.log(`ID: ${u.id} | MAIL: [${u.mail}] | PASS: [${u.motdepasse}]`);
  });
  console.log('--- USERS END ---');
  
  await app.close();
}
bootstrap();
