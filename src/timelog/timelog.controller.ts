import { Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { TimeLogService } from './timelog.service';
import { Request } from 'express';
import { UserEntity } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/entities/roles.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('time-log')
@UseGuards(AuthGuard())
export class TimeLogController {
  constructor(private readonly timeLogService: TimeLogService) {}


 
  // Time In
  @Post('time-in')
  async timeIn(@Req() req: Request) {
    const user = req.user as UserEntity; // user retrieved from JWT token
    return this.timeLogService.timeIn(user);
  }


  // Time Out
  @Post('time-out')
  async timeOut(@Req() req: Request) {
    const user = req.user as UserEntity;
    return this.timeLogService.timeOut(user);
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
  async getAllTimeLogs() {
    return this.timeLogService.getAllTimeLogs();
  }
  
  @Get('user/logs')
  async getTimeLogsForAuthenticatedUser(@Req() req: Request) {
    const user = req.user as UserEntity;  // Get authenticated user
    return this.timeLogService.getTimeLogsForAuthenticatedUser(user);
  }
}
