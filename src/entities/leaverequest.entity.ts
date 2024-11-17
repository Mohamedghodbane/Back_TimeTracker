import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { LeaveRequestStatus } from './LeaveRequestStatus.enum';

@Entity('leave_request')
export class LeaveRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.leaveRequests)
  user: UserEntity;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  reason: string;

  @Column({ type: 'enum', enum: LeaveRequestStatus, default: LeaveRequestStatus.PENDING })
  status: LeaveRequestStatus;
  @CreateDateColumn()
  createdAt: Date;
}
