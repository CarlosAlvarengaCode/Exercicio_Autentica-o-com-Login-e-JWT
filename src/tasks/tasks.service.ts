import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tasks } from './entities/tesks.entity';
import { CreateTasksDto } from './dto/create-tasks-dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger('TasksService');

  async create(dto: CreateTasksDto) {
    this.logger.log(`Creating task for user ${dto.userId}`);
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });

    if (!user) {
      this.logger.warn(`User ${dto.userId} not found when creating task`);
      throw new NotFoundException('Usuário não encontrado');
    }

    const task = this.tasksRepository.create({
      title: dto.title,
      description: dto.description,
      status: dto.status,
      user: user,
    });

    const saved = await this.tasksRepository.save(task);
    this.logger.log(`Task ${saved.id} created successfully`);
    return saved;
  }

  async findAll() {
    this.logger.log('Fetching all tasks');

    const tasks = await this.tasksRepository.find({
      relations: ['user'],
    });

    this.logger.log(`Retrieved ${tasks.length} tasks`);
    return tasks;
  }

  async findOneById(id: number) {
    this.logger.log(`Fetching task with id ${id}`);
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) this.logger.warn(`Task ${id} not found`);
    return task;
  }
  async findAllByUser(usuarioId: number) {
    this.logger.log(`Fetching tasks for user ${usuarioId}`);
    const tasks = await this.tasksRepository.find({
      where: { user: { id: usuarioId } },
      relations: ['user'],
    });
    this.logger.log(`Retrieved ${tasks.length} tasks for user ${usuarioId}`);
    return tasks;
  }
  async update(id: number, data: UpdateTasksDto) {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }

    if (data.title !== undefined) {
      task.title = data.title;
    }

    if (data.description !== undefined) {
      task.description = data.description;
    }

    if (data.status !== undefined) {
      task.status = data.status;
    }

    if (data.userId !== undefined) {
      const user = await this.userRepository.findOne({
        where: { id: data.userId },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      task.user = user;
    }

    await this.tasksRepository.save(task);

    return { message: 'Task atualizada com sucesso' };
  }

  async remove(id: number) {
    this.logger.log(`Removing task ${id}`);
    const task = await this.findOneById(id);
    if (!task) {
      this.logger.warn(`Task ${id} not found when removing`);
      throw new NotFoundException('Task não encontrada');
    }

    await this.tasksRepository.remove(task);
    this.logger.log(`Task ${id} removed successfully`);
    return { message: 'Task removida com sucesso' };
  }
}
