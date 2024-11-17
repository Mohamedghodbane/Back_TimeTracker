import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeLog } from 'src/entities/timelog.entity'; 
import { TimeLogService } from './timelog.service';
import { TimeLogController } from './timelog.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeLog]), 
    AuthModule,
  ],
  providers: [TimeLogService],
  controllers: [TimeLogController],
})
export class TimelogModule {}
