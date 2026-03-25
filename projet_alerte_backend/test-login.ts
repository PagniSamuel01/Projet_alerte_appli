import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UsersService);
  
  console.log('--- TEST LOGIN START ---');
  try {
    const user = await userService.login({ mail: 'Bonjour', motdepasse: 'Samuel' });
    console.log('Login SUCCESS:', user.id);
  } catch (e) {
    console.log('Login FAILED:', e.message);
  }
  console.log('--- TEST LOGIN END ---');
  
  await app.close();
}
bootstrap();
