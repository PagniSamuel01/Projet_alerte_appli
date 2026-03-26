import { Test, TestingModule } from '@nestjs/testing';
import { FormAlerteService } from './form_alerte.service';

describe('FormAlerteService', () => {
  let service: FormAlerteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormAlerteService],
    }).compile();

    service = module.get<FormAlerteService>(FormAlerteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
