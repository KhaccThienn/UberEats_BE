import { Test, TestingModule } from '@nestjs/testing';
import { UpdateStatusService } from './update-status.service';

describe('UpdateStatusService', () => {
  let service: UpdateStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateStatusService],
    }).compile();

    service = module.get<UpdateStatusService>(UpdateStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
