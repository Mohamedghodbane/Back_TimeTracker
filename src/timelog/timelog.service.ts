import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeLog } from 'src/entities/timelog.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UserRole } from 'src/entities/roles.enum';

@Injectable()
export class TimeLogService {
  constructor(
    @InjectRepository(TimeLog)
    private timeLogRepository: Repository<TimeLog>,
  ) {}

  
  private getToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  //time in
  async timeIn(user: UserEntity): Promise<TimeLog> {
    const today = this.getToday(); 
  
    // Check if there is already a clock-in today
    const existingLog = await this.timeLogRepository.findOne({
      where: { user, date: today, timeOut: null }, // Check for incomplete records (timeOut is null)
    });
  
    if (existingLog) {
      throw new BadRequestException('You have already clocked in today.');
    }
  
    // Create a new time log for the user
    const timeLog = this.timeLogRepository.create({
      user,
      timeIn: new Date(),
      date: today,
    });
  
    return this.timeLogRepository.save(timeLog);
  }
  
  // Time Out
  async timeOut(user: UserEntity): Promise<TimeLog> {
    // Find the user's open time log for today (clocked in but not clocked out)
    const today = this.getToday();
    const timeLog = await this.timeLogRepository.findOne({
      where: { user, date: today, timeOut: null },
    });
  
    if (!timeLog) {
      throw new BadRequestException('You need to clock in first.');
    }
  
    // Set the timeOut to the current time and calculate the total hours
    timeLog.timeOut = new Date();
    const timeIn = new Date(timeLog.timeIn);
    const timeOut = new Date(timeLog.timeOut);
  
    timeLog.totalHours = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60); // In hours
  
    return this.timeLogRepository.save(timeLog);
  }
  async getAllTimeLogs(): Promise<TimeLog[]> {
    return this.timeLogRepository.find({ relations: ['user'] });
  }
  

  async getTimeLogsForAuthenticatedUser(user: UserEntity): Promise<TimeLog[]> {
    // Admins can get all time logs
    if (user.role === UserRole.ADMIN) {
      return this.timeLogRepository.find({ relations: ['user'] }); // Include user data for admin
    }
  
    // Regular users can only see their own time logs
    return this.timeLogRepository.find({ where: { user }, relations: ['user'] });
  }
  
}
