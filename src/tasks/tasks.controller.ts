import {
  Controller,
  Post,
  Get,
  Put,
  Logger,
  Delete,
  UseGuards,
  Req,
  Body,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTasksDto } from './dto/create-tasks-dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  private readonly logger = new Logger('TasksService');
  @Post()
  async criar(@Body() dto: CreateTasksDto) {
    return this.tasksService.create({
      ...dto,
    });
  }

  @Get()
  async listar() {
    return this.tasksService.findAll();
  }
  @Put(':id')
  async atualizar(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateTasksDto,
  ) {
    const usuarioId = req.user.id ?? req.user.sub;

    this.logger.log(
      `Usuário ${usuarioId} atualizando task ${id} com dados: ${JSON.stringify(dto)}`,
    );

    return this.tasksService.update(Number(id), dto);
  }
  @Delete(':id')
  async deletar(@Param('id') id: string) {
    return this.tasksService.remove(Number(id));
  }
}
