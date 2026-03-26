import {
  Controller,
  Body,
  Post,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FormAlerte } from './form.entity';
import { FormAlerteService } from './form_alerte.service';

@Controller('form-alerte')
export class FormAlerteController {
  constructor(private readonly formService: FormAlerteService) {}

  @Post('alerte')
  async register(@Body() formData: Partial<FormAlerte>): Promise<FormAlerte> {
    try {
      return await this.formService.create(formData);
    } catch (error) {
      console.error('Erreur du serveur dedié (register)', error);
      throw new HttpException(
        {
          message: "Erreur de l'envoie de l'alerte",
          details: error.message || error.toString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get()
  async findAll() {
    return this.formService.findAll();
  }
  @Post('application')
  async application(
    @Body() formData: Partial<FormAlerte>,
  ): Promise<FormAlerte> {
    try {
      return await this.formService.application(formData);
    } catch (error) {
      console.error('Erreur du serveur dedié (application)', error.message);
      throw new HttpException(
        "Erreur de l'envoie de l'application",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
