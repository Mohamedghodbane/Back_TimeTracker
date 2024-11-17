import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { registerUserDto } from 'src/DTO/registerUser.dto';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserLoginDto } from 'src/DTO/userLogin.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserRole } from 'src/entities/roles.enum';

@Injectable()
export class AuthService {

    constructor (@InjectRepository(UserEntity) private repo: Repository<UserEntity> , private jwt : JwtService){

  }
  async registerUser(registerDTO: registerUserDto): Promise<UserEntity> {
    const { username, password, role } = registerDTO;

    // Hash the password and generate a salt
    const hashed = await bcrypt.hash(password, 12);
    const salt = await bcrypt.getSalt(hashed);

    // Create the new user
    const user = new UserEntity();
    user.username = username;
    user.password = hashed;  // Store hashed password
    user.salt = salt;  // Store salt

    // Assign the role, defaulting to 'user' if no role is provided
    user.role = role || UserRole.USER;

    this.repo.create(user);

    try {
      // Save the user to the database
      return await this.repo.save(user);
    } catch (err) {
      throw new InternalServerErrorException('Something went wrong, user was not created.');
    }
  }

async loginUser(userLoginDTO: UserLoginDto) : Promise<{ jwtToken: string; role: string }>
{
  const {username,password} = userLoginDTO;
const user = await this.repo.findOne({ where: { username } });
  if (!user){ throw new UnauthorizedException('invalid credentials');
}



const isPasswordMatch  = await bcrypt.compare(password, user.password);
  if (isPasswordMatch ){
    const jwtPayload = { username, role: user.role };
     const jwtToken = await this.jwt.signAsync(jwtPayload,{expiresIn:'1d',algorithm:'HS512'});
     return { jwtToken, role: user.role };
  }  else {
      throw new UnauthorizedException('invalid credentials');
    }
}



async getAllUsers(): Promise<UserEntity[]> {
  try {
    return await this.repo.find(); // Fetch all users
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new InternalServerErrorException('Error fetching users');
  }
}


}