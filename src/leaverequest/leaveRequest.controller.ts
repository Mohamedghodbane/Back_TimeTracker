import { Controller, Post, Get, Patch, Delete, Body, Request ,Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LeaveRequestService } from './leaverequest.service';
import { CreateLeaveRequestDto } from '../DTO/create-leave-request.dto';
import { UpdateLeaveRequestStatusDto } from '../DTO/update-leave-request-status.dto';
import { User } from '../auth/user.decorator'; 
import { UserEntity } from 'src/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/entities/roles.enum';

@Controller('request')
@UseGuards(AuthGuard())
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveRequestController {
  constructor(private leaveRequestService: LeaveRequestService) {}

 
  @Get('getall')
@Roles(UserRole.ADMIN)
async getAllLeaveRequests() {
  const leaveRequests = await this.leaveRequestService.getAllLeaveRequests();
  return leaveRequests.map((request) => ({
    id: request.id,
    startDate: request.startDate,
    endDate: request.endDate,
    reason: request.reason,
    status: request.status,
    username: request.user?.username, 
  }));
}


  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createLeaveRequest(
    @Body() createLeaveDto: CreateLeaveRequestDto,
    @User() user: UserEntity, // Use custom decorator to get user
  ) {
    return this.leaveRequestService.createLeaveRequest(user, createLeaveDto);
  }
  
  // Get all leave requests for the logged-in user
  @Get('get')
  async getLeaveRequests(@User() user: UserEntity) {
    return this.leaveRequestService.getLeaveRequestsByUser(user);
  }

  // Update the status of a leave request (Admin functionality)
  @Patch(':id/status')
  async updateLeaveRequestStatus(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaveRequestStatusDto: UpdateLeaveRequestStatusDto,
  ) {
    return this.leaveRequestService.updateLeaveRequestStatus(user, id, updateLeaveRequestStatusDto);
  }

 
  @Delete(':id')
  async deleteLeaveRequest(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.leaveRequestService.deleteLeaveRequest(user, id);
  }

}

