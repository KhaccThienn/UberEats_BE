/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { Status } from '../model/status.enum';

export const STATUS_KEYS = 'status';
export const Statuses = (...stt: Status[]) => SetMetadata('STATUS_KEYS', stt);
