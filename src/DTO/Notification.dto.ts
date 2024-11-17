// src/DTO/notification.dto.ts
import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { NotificationType } from 'src/entities/NotificationType.enum';

export class NotificationDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number; // Representing the user ID (instead of passing the whole user object)

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  notificationType: NotificationType; // Ensure this matches the enum values
}
