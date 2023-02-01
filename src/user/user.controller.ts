import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { EditObject } from '../auth/dto';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('/')
    getUser(@GetUser() user: User) {
        return this.userService.getUser(user);
    }
    @Patch('/edit')
    editUser(@GetUser() user: User, @Body() body: EditObject) {
        return this.userService.editUser(user, body);
    }
}
