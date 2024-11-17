import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { TimelogModule } from './timelog/timelog.module';
import { LeaveRequestModule } from './leaverequest/LeaveRequest.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',        // Database host (localhost for local development)
      port: 5432,               // Default port for PostgreSQL
      username: 'postgres', // Your PostgreSQL username
      password: 'root', // Your PostgreSQL password
      database: 'couv', // Your PostgreSQL database name
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Load entities
      synchronize: true,        // Auto-sync the database schema, set to false in production
    }),
   
   
   
    AuthModule, 
    TimelogModule,
    LeaveRequestModule,
   
  ],
  controllers: [AppController],
  providers: [AppService ],
  
})
export class AppModule {}


