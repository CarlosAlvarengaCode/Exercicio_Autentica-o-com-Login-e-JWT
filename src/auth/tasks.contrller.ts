import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from '../tasks/tasks.service';

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {

  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async criar(@Req() req: any) {
    const { titulo, descricao } = req.body;
    const usuarioId = req.user.id || req.user.sub;

    return this.tasksService.criar(titulo, descricao, usuarioId);
  }
}
