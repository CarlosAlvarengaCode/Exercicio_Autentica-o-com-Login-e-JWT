import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tasks } from 'src/tasks/entities/tesks.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToMany(() => Tasks, (task) => task.user)
  tasks: Tasks[];
}
