import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { FormAlerte } from './form.entity';

@Injectable()
export class AlerteSchedulerService {
  private readonly logger = new Logger(AlerteSchedulerService.name);

  constructor(
    @InjectRepository(FormAlerte)
    private readonly formRepository: Repository<FormAlerte>,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * Tâche planifiée : s'exécute chaque jour à 8h00
   * Vérifie les alertes dont la date est dans exactement 7 jours
   * et envoie un email de rappel
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Chaque jour à minuit
  async envoyerRappelsJ7() {
    this.logger.log('Vérification des alertes J-7...');

    // Calculer la date dans 7 jours (début et fin de journée)
    const dans7Jours = new Date();
    dans7Jours.setDate(dans7Jours.getDate() + 7);

    const debut = new Date(dans7Jours);
    debut.setHours(0, 0, 0, 0);

    const fin = new Date(dans7Jours);
    fin.setHours(23, 59, 59, 999);

    // Chercher toutes les alertes prévues dans 7 jours
    const alertes = await this.formRepository.find({
      where: {
        date_alerte: Between(debut, fin),
      },
    });

    this.logger.log(`${alertes.length} alerte(s) à rappeler dans 7 jours`);

    // Envoyer un email pour chaque alerte trouvée
    for (const alerte of alertes) {
      try {
        await this.mailerService.sendMail({
          to: alerte.email,
          subject:
            '⏰ Rappel : Oubliez pas! votre abonnement finit dans 7 jours',
          html: `
            <h2>Rappel d'abonnement</h2>
            <p>Bonjour,</p>
            <p>Ceci est un rappel : Votre abonnement de l'application ${alerte.appli} prend fin dans <strong>7 jours</strong>.</p>
            <hr>
            <p><strong>Date d'alerte :</strong> ${new Date(alerte.date_alerte).toLocaleString('fr-FR')}</p>
            <hr>
            <p>Merci de prendre les dispositions nécessaires.</p>
          `,
        });
        this.logger.log(
          `Rappel envoyé à ${alerte.email} pour l'alerte du ${alerte.date_alerte}`,
        );
      } catch (error) {
        this.logger.error(
          `Erreur envoi rappel à ${alerte.email} :`,
          error.message,
        );
      }
    }
  }

  /**
   * Tâche planifiée : s'exécute chaque jour à minuit
   * Vérifie les alertes dont la date est dans exactement 3 jours
   * et envoie un email de rappel
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Chaque jour à minuit
  async envoyerRappelsJ3() {
    this.logger.log('Vérification des alertes J-3...');

    const dans3Jours = new Date();
    dans3Jours.setDate(dans3Jours.getDate() + 3);

    const debut = new Date(dans3Jours);
    debut.setHours(0, 0, 0, 0);

    const fin = new Date(dans3Jours);
    fin.setHours(23, 59, 59, 999);

    const alertes = await this.formRepository.find({
      where: {
        date_alerte: Between(debut, fin),
      },
    });

    this.logger.log(`${alertes.length} alerte(s) à rappeler dans 3 jours`);

    for (const alerte of alertes) {
      try {
        await this.mailerService.sendMail({
          to: alerte.email,
          subject: '⚠️ Rappel : Votre abonnement finit dans 3 jours',
          html: `
            <h2>Rappel d'abonnement</h2>
            <p>Bonjour,</p>
            <p>Attention, il ne vous reste plus que <strong>3 jours</strong> d'abonnement pour l'application ${alerte.appli}.</p>
            <hr>
            <p><strong>Date de fin :</strong> ${new Date(alerte.date_alerte).toLocaleString('fr-FR')}</p>
            <hr>
            <p>Merci de renouveler votre abonnement ou de prendre les dispositions nécessaires.</p>
          `,
        });
        this.logger.log(`Rappel J-3 envoyé à ${alerte.email}`);
      } catch (error) {
        this.logger.error(
          `Erreur envoi rappel J-3 à ${alerte.email} :`,
          error.message,
        );
      }
    }
  }

  @Cron('0 8 * * *') // Chaque jour à 8h00
  async envoyerAlerteJourJ() {
    this.logger.log('Vérification des alertes du Jour J...');

    const aujourdHui = new Date();

    const debut = new Date(aujourdHui);
    debut.setHours(0, 0, 0, 0);

    const fin = new Date(aujourdHui);
    fin.setHours(23, 59, 59, 999);

    const alertes = await this.formRepository.find({
      where: {
        date_alerte: Between(debut, fin),
      },
    });

    this.logger.log(`${alertes.length} alerte(s) pour aujourd'hui (Jour J)`);

    for (const alerte of alertes) {
      try {
        await this.mailerService.sendMail({
          to: alerte.email,
          subject: "🚨 FIN D'ABONNEMENT : Votre abonnement expire aujourd'hui",
          html: `
            <h2>Fin d'abonnement</h2>
            <p>Bonjour,</p>
            <p>Votre abonnement pour l'application <strong>${alerte.appli}</strong> expire <strong>aujourd'hui</strong>.</p>
            <hr>
            <p><strong>Date de fin :</strong> ${new Date(alerte.date_alerte).toLocaleString('fr-FR')}</p>
            <hr>
            <p>Une action de votre part est désormais requise.</p>
          `,
        });
        this.logger.log(`Alerte Jour J envoyée à ${alerte.email}`);
      } catch (error) {
        this.logger.error(
          `Erreur envoi alerte Jour J à ${alerte.email} :`,
          error.message,
        );
      }
    }
  }
}
