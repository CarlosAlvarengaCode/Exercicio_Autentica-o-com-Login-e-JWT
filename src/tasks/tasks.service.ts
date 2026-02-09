import { Injectable } from '@nestjs/common';
import db from '../database/tasksDb';

@Injectable()
export class TasksService {

  async criar(titulo: string, descricao: string, usuarioId: number) {
    await db.query(
      `INSERT INTO tasks (titulo, descricao, usuario_id)
       VALUES (?, ?, ?)`,
      [titulo, descricao, usuarioId]
    );

    return { message: 'Task criada com sucesso' };
  }
}
