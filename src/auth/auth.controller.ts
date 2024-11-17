import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerUserDto } from 'src/DTO/registerUser.dto';
import { UserLoginDto } from 'src/DTO/userLogin.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserRole } from 'src/entities/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from './roles.decorator';
 
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('register')
  register(@Body(ValidationPipe) regDTO: registerUserDto) {
    return this.authService.registerUser(regDTO);
  }

  // User Login
  @Post('login')
  login(@Body(ValidationPipe) loginDTO: UserLoginDto) {
    return this.authService.loginUser(loginDTO);
  }

  // Example of a Protected Route
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  protectedRoute() {
    return 'This route is protected and requires a valid JWT token';
  }
  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers() {
    return this.authService.getAllUsers();
  }
}
