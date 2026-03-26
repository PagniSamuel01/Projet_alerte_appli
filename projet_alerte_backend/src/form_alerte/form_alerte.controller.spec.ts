import { Test, TestingModule } from '@nestjs/testing';
import { FormAlerteController } from './form_alerte.controller';

describe('FormAlerteController', () => {
  let controller: FormAlerteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormAlerteController],
    }).compile();

    controller = module.get<FormAlerteController>(FormAlerteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
