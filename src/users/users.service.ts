import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Criar usuário
  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  // Listar todos os usuários
  async findAll() {
    return this.userRepository.find();
  }

  // Buscar usuário por ID
  async findOneById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  // Buscar usuário por email
  async findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  // Atualizar usuário
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  // Remover usuário
  async remove(id: number) {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    await this.userRepository.remove(user);
    return { message: 'Usuário deletado com sucesso' };
  }
}
