import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UsersService);
  
  const mailToTest = 'Bonjour';
  console.log(`--- TEST RECHERCHE POUR [${mailToTest}] ---`);
  
  try {
    const user = await userService.findOneByEmail(mailToTest);
    if (user) {
      console.log('TROUVÉ:', user.id, `MAIL: [${user.mail}]`);
    } else {
      console.log('NON TROUVÉ');
    }
  } catch (e) {
    console.log('ERREUR:', e.message);
  }
  
  await app.close();
}
bootstrap();
