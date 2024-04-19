import { UserService } from './users.service';
import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import {UsersResponseDto} from "./users.response.dto";


@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getSomeUsers(
    @Query('numPage') numPage,
    @Query('limit') limit,
  ) {
    this.logger.log('Get users by page');
    const {usersData, totalPages} = await this.userService.findByPage(numPage, limit);
    const users =  usersData.map((user) => UsersResponseDto.fromUsersEntity(user));
    return {users, totalPages}
  }
}

