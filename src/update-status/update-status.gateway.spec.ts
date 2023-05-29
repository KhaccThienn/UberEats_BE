import { Test, TestingModule } from '@nestjs/testing';
import { UpdateStatusGateway } from './update-status.gateway';
import { UpdateStatusService } from './update-status.service';

describe('UpdateStatusGateway', () => {
  let gateway: UpdateStatusGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateStatusGateway, UpdateStatusService],
    }).compile();

    gateway = module.get<UpdateStatusGateway>(UpdateStatusGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
