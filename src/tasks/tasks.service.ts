import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tasks } from './entities/tesks.entity';
import { CreateTasksDto } from './dto/create-tasks-dto';
import { UpdateTasksDto} from './dto/update-tasks.dto';



@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>, 
     

  ) {}
private readonly logger = new Logger('TasksService')
  async create(dto: CreateTasksDto) {
    const task = this.tasksRepository.create(dto);
    return this.tasksRepository.save(task);
  }

  async findAll() {
    return this.tasksRepository.find();
  }

  async findOneById(id: number) {
    return this.tasksRepository.findOne({ where: { id } });
  }
async findAllByUser(usuarioId: number) {
  return this.tasksRepository.find({ where: { usuarioId } });
}

 async update(id: number, usuarioId: number, data: UpdateTasksDto) {
  const task = await this.tasksRepository.findOne({
    where: { id, usuarioId },
  });

  if (!task) {
    throw new NotFoundException('Task não encontrada');
  }

  await this.tasksRepository.update(id, data);

  return { message: 'Task atualizada com sucesso' };
}


  async remove(id: number) {
    const task = await this.findOneById(id);
    if (!task) throw new NotFoundException('Task não encontrada');

    await this.tasksRepository.remove(task);
    return { message: 'Task removida com sucesso' };
  }
}
