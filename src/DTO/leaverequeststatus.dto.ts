import { IsEnum } from 'class-validator';
import { distinctUntilKeyChanged } from 'rxjs';
import { LeaveRequestStatus } from 'src/entities/leaverequeststatus.enum'; // Ensure you import the enum

export class UpdateLeaveRequestStatusDto {
  @IsEnum(LeaveRequestStatus)
  status: LeaveRequestStatus; // This ensures the status can only be one of the enum values (Pending, Accepted, Refused)
}
