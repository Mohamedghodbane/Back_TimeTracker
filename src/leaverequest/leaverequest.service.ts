import { Injectable, NotFoundException, ForbiddenException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest } from 'src/entities/leaverequest.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateLeaveRequestDto } from '../DTO/create-leave-request.dto';
import { UpdateLeaveRequestStatusDto } from '../DTO/update-leave-request-status.dto';
import { UserRole } from 'src/entities/roles.enum'; 
import { LeaveRequestStatus } from 'src/entities/LeaveRequestStatus.enum';
import { NotificationType } from 'src/entities/NotificationType.enum';

@Injectable()
export class LeaveRequestService {
  constructor(
    @InjectRepository(LeaveRequest)
    private leaveRequestRepository: Repository<LeaveRequest>,
 
  ) {}

  async createLeaveRequest(user: UserEntity, createLeaveDto: CreateLeaveRequestDto): Promise<LeaveRequest> {
    const leaveRequest = this.leaveRequestRepository.create({
      startDate: createLeaveDto.startDate,
      endDate: createLeaveDto.endDate,
      reason: createLeaveDto.reason,
      status: LeaveRequestStatus.PENDING,
      user,
      createdAt: new Date(),
    });
    return this.leaveRequestRepository.save(leaveRequest);
  }

  async getLeaveRequestsByUser(user: UserEntity): Promise<LeaveRequest[]> {
    if (user.role === UserRole.ADMIN) {
      return this.leaveRequestRepository.find({ relations: ['user'] });
    }
    return this.leaveRequestRepository.find({ where: { user }, relations: ['user'] });
  }

  async getLeaveRequestById(user: UserEntity, id: number): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOne({ where: { id }, relations: ['user'] });
    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found.');
    }
    if (user.role !== UserRole.ADMIN && leaveRequest.user.id !== user.id) {
      throw new ForbiddenException('You are not allowed to access this leave request.');
    }
    return leaveRequest;
  }

  async updateLeaveRequestStatus(
    user: UserEntity,
    id: number,
    updateLeaveRequestStatusDto: UpdateLeaveRequestStatusDto
  ): Promise<LeaveRequest> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to update the leave request status.');
    }

    const leaveRequest = await this.leaveRequestRepository.findOne({ where: { id }, relations: ['user'] });
    if (!leaveRequest) {
      throw new NotFoundException(`Leave request with ID ${id} not found.`);
    }

    const { status } = updateLeaveRequestStatusDto;
    if (![LeaveRequestStatus.ACCEPTED, LeaveRequestStatus.REFUSED].includes(status)) {
      throw new BadRequestException('Invalid status. Status must be either "Accepted" or "Refused".');
    }

    leaveRequest.status = status;

 
    return this.leaveRequestRepository.save(leaveRequest);
  }

  async deleteLeaveRequest(user: UserEntity, id: number): Promise<void> {
    const leaveRequest = await this.getLeaveRequestById(user, id);
    if (user.role !== UserRole.ADMIN && leaveRequest.user.id !== user.id) {
      throw new ForbiddenException('You are not allowed to delete this leave request.');
    }
    await this.leaveRequestRepository.remove(leaveRequest);
  }

  
  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.find({
      relations: ['user'], 
        });
  }
  
}
