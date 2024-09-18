import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<User> {
        return this.usersService.legacyFindUserById(id);
    }


}
