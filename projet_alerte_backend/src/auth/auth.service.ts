import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  // 0. Connexion
  async login(email: string, password: string) {
    return this.usersService.login({ mail: email, motdepasse: password });
  }

  // 1. Demande de réinitialisation
  async forgotPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      // Sécurité : on ne dit pas si l'email existe ou non, mais ici pour le projet on peut être explicite
      throw new NotFoundException("Utilisateur non trouvé");
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expire dans 1 heure

    // Enregistrement du token via TypeORM
    await this.usersService.setResetToken(user.id, token, expiresAt);

    // Envoi de l'email
    await this.sendResetEmail(email, token);

    return { message: "Un email de réinitialisation a été envoyé." };
  }

  // 2. Réinitialisation effective
  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);

    if (!user) {
      throw new BadRequestException("Jeton invalide.");
    }

    // Vérification de l'expiration
    if (user.resetTokenExpiry && newPassword && new Date() > user.resetTokenExpiry) {
      throw new BadRequestException("Jeton expiré.");
    }

    // Mise à jour du mot de passe
    await this.usersService.updatePassword(user.id, newPassword);

    return { message: "Votre mot de passe a été réinitialisé avec succès." };
  }

  // 3. Envoi de l'email
  private async sendResetEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'trvmisvmi@gmail.com', // À CONFIGURER
        pass: 'gatjctsrvbnwsoha', // À CONFIGURER 
      },
    });

    // On remplace localhost par l'IP réelle pour que ça marche aussi sur mobile/tablette (sur le même réseau)
    // Synchronisation forcée du port 4200
    const resetLink = `http://192.168.1.189:4200/reset-password?token=${token}`; 

    await transporter.sendMail({
      from: '" Alerte" <no-reply@projetalerte.com>',
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: ` 
        <div style="background-color: #f8f9fa; padding: 40px 20px; font-family: 'Segoe UI', Arial, sans-serif;">
          <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <h2 style="color: #333; font-size: 24px; margin-bottom: 20px; text-align: center;">Réinitialisation de mot de passe</h2>
            <p style="color: #555; font-size: 16px;">Bonjour,</p>
            <p style="color: #555; font-size: 16px;">Vous avez demandé la réinitialisation de votre mot de passe pour votre compte <strong>Projet Alerte</strong>.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #0066ff; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Réinitialiser mon mot de passe</a>
            </div>
            <p style="color: #888; font-size: 14px; text-align: center;">Ce lien expirera dans 1 heure.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 13px; text-align: center;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
          </div>
        </div>
      `,
    });
  }
}

