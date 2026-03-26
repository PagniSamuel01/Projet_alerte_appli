import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormAlerte } from './form.entity';
import { Repository } from 'typeorm';
@Injectable()
export class FormAlerteService {
  constructor(
    @InjectRepository(FormAlerte)
    private formRepository: Repository<FormAlerte>,
  ) {}
  async create(formData: Partial<FormAlerte>): Promise<FormAlerte> {
    if (formData.email) formData.email = formData.email.trim();
    if (formData.appli) formData.appli = formData.appli.trim();
    console.log('donnees recu', formData);
    const nouvelleAlert = this.formRepository.create(formData);
    return await this.formRepository.save(nouvelleAlert);
  }
  async findAll(): Promise<FormAlerte[]> {
    return await this.formRepository.find();
  }
  async application(donnee: Partial<FormAlerte>): Promise<FormAlerte> {
    const nouvelleAppli = this.formRepository.create(donnee);
    return await this.formRepository.save(nouvelleAppli);
  }
}
