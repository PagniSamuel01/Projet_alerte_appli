import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    if (userData.mail) userData.mail = userData.mail.trim();
    if (userData.motdepasse) userData.motdepasse = userData.motdepasse.trim();
    
    console.log('Création d\'utilisateur avec:', userData);
    const newUser = this.usersRepository.create(userData);
    return await this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOneByEmail(mail: string): Promise<User | null> {
    const searchMail = mail.trim().toLowerCase();
    // Utiliser findOneBy pour l'efficacité au lieu de findAll().find()
    return await this.usersRepository.findOneBy({ mail: searchMail });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ resetToken: token });
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    await this.usersRepository.update(userId, { 
      motdepasse: newPassword, // Note: Devrait être hashé idéalement
      resetToken: null, 
      resetTokenExpiry: null 
    });
  }

  async setResetToken(userId: number, token: string, expiry: Date): Promise<void> {
    await this.usersRepository.update(userId, {
      resetToken: token,
      resetTokenExpiry: expiry
    });
  }

  async login(userData: Partial<User>): Promise<User> {
    if (!userData.mail) {
      throw new Error('Email requis');
    }
    const inputMail = userData.mail.trim();
    const user = await this.findOneByEmail(inputMail);
    
    console.log('Utilisateur trouvé:', user ? { id: user.id, mail: user.mail.trim() } : 'AUCUN');
    
    if (user) {
      const dbPass = user.motdepasse.trim();
      const inputPass = userData.motdepasse?.trim();
      
      console.log(`Comparaison pass: [${dbPass}] === [${inputPass}]`);
      if (dbPass === inputPass) {
        return user;
      }
    }
    throw new Error('Identifiants invalides');
  }
}
