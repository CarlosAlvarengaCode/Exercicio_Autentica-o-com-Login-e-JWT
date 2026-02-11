import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tasks')
export class Tasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'pendente' })
  status: string;
   @Column()
  usuarioId: number;
}


