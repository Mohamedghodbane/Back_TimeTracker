// src/leave-request/leave-request.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequestService } from './leaverequest.service';
import { LeaveRequestController } from './leaveRequest.controller';
import { LeaveRequest } from 'src/entities/leaverequest.entity';
import { UserEntity } from 'src/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveRequest, UserEntity]),
    AuthModule,

  ],
  controllers: [LeaveRequestController],
  providers: [LeaveRequestService],
})
export class LeaveRequestModule {}
