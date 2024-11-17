// src/leave-request/dto/create-leave-request.dto.ts

import { IsNotEmpty, IsDateString } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  reason: string;
}
