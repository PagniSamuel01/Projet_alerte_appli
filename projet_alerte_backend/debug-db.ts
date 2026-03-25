import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UsersService);
  
  const users = await userService.findAll();
  console.log('--- DB DUMP ---');
  for (const u of users) {
    console.log(`USER: ID=${u.id}, MAIL="${u.mail}" (len:${u.mail.length}), PASS="${u.motdepasse}" (len:${u.motdepasse.length})`);
    
    // Test direct findOne with exact match from DB
    const found = await userService.findOneByEmail(u.mail);
    console.log(`Recherche de "${u.mail}" -> ${found ? 'TROUVÉ' : 'NON TROUVÉ'}`);
  }
  
  console.log('--- TEST MANUEL ---');
  const testMail = 'Bonjour';
  const foundManual = await userService.findOneByEmail(testMail);
  console.log(`Recherche manuelle de "${testMail}" -> ${foundManual ? 'TROUVÉ' : 'NON TROUVÉ'}`);
  
  await app.close();
}
bootstrap();
