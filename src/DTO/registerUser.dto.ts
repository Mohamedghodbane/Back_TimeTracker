
import {IsNotEmpty, Matches, MaxLength, IsEmail ,MinLength, IsOptional, IsEnum} from "class-validator"
import { UserRole } from "src/entities/roles.enum";
export class registerUserDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()

    @MinLength(6) @MaxLength(12)
    @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one number, and be at least 8 characters long',
      })
    password: string;
  

    // Optional role field (can default to 'user' if not provided)
  @IsOptional()
  @IsEnum(UserRole, { message: 'role must be either admin or user' })
  role?: UserRole;
    }
