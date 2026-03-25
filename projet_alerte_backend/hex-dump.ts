import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UsersService);
  
  const users = await userService.findAll();
  console.log('--- HEX DUMP ---');
  users.forEach(u => {
    const mailHex = Buffer.from(u.mail).toString('hex');
    console.log(`ID: ${u.id} | MAIL: [${u.mail}] | HEX: ${mailHex}`);
    for (let i = 0; i < u.mail.length; i++) {
        console.log(`Char at ${i}: [${u.mail[i]}] Code: ${u.mail.charCodeAt(i)}`);
    }
  });
  
  await app.close();
}
bootstrap();
