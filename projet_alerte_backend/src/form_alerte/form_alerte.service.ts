import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormAlerte } from './form.entity';
import { Repository } from 'typeorm';
import{MailerService} from '@nestjs-modules/mailer';
@Injectable()
export class FormAlerteService {
  constructor(
    @InjectRepository(FormAlerte)
    private readonly formRepository: Repository<FormAlerte>,
    private readonly mailerService: MailerService,
  ) {}
  async create(formData: Partial<FormAlerte>): Promise<FormAlerte> {
    if (formData.email) formData.email = formData.email.trim();
    if (formData.appli) formData.appli = formData.appli.trim();
    console.log('donnees recu', formData);

    // 1. Sauvegarde en base de données
    const nouvelleAlert = this.formRepository.create(formData);
    const result = await this.formRepository.save(nouvelleAlert);

    // 2. Envoi de l'email (indépendant de la sauvegarde)
    try {
      await this.mailerService.sendMail({
        to: formData.email,
        subject: '🚨 Alerte système générée',
        html: `
          <h2>Alerte générée</h2>
          <p><strong>Application :</strong> ${formData.appli}</p>
          <p><strong>Date d'alerte :</strong> ${formData.date_alerte}</p>
          <p>Cette alerte a été enregistrée avec succès.</p>
        `,
      });
      console.log('Email envoyé avec succès à', formData.email);
    } catch (emailError) {
      // L'email a échoué mais l'alerte est sauvegardée — on log sans bloquer
      console.error('Erreur envoi email (non bloquant):', emailError.message);
    }

    return result;
  }
  async findAll(): Promise<FormAlerte[]> {
    return await this.formRepository.find();
  }
  async application(donnee: Partial<FormAlerte>): Promise<FormAlerte> {
    const nouvelleAppli = this.formRepository.create(donnee);
    return await this.formRepository.save(nouvelleAppli);
  }
}
