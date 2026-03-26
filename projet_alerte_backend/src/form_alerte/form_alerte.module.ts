import { Module } from '@nestjs/common';
import { FormAlerteService } from './form_alerte.service';
import { FormAlerteController } from './form_alerte.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormAlerte } from './form.entity';
@Module({
  imports: [TypeOrmModule.forFeature([FormAlerte])],
  providers: [FormAlerteService],
  controllers: [FormAlerteController],
  exports: [FormAlerteService],
})
export class FormAlerteModule {}
