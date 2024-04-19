import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAll(): Promise<UsersEntity[]> {
    return await this.usersRepo.find();
  }
  
  async findByPage(page = 1, limit = 20): Promise<{usersData: UsersEntity[]; totalPages: number;}>  {
    const offset = page > 0 ? (page - 1) * limit : 0;
    const [usersData, total] = await this.usersRepo.findAndCount({skip: offset, take: limit});
    const totalPages = Math.ceil(total / limit);
    return{
      usersData,
      totalPages,
    };
  }
}
