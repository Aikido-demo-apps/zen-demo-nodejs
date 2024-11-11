import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { log } from 'console';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(':id')
    @ApiOperation({ summary: 'Fetch a user by its ID' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the user' })
    async getUserById(@Param('id') id: string): Promise<User> {
        return this.usersService.legacyFindUserById(id);
    }


}
