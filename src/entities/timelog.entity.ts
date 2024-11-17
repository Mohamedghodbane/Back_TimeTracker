import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BeforeInsert } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('time_logs')
export class TimeLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timeIn: Date;

  @Column({ type: 'timestamp', nullable: true })
  timeOut: Date;

  @Column({ type: 'float', nullable: true })
  totalHours: number;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => UserEntity, (user) => user.timeLogs)
  user: UserEntity;

  @BeforeInsert()
  setDate() {
    this.date = new Date(); 
  }
}
