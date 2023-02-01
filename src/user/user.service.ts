import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { EditObject } from '../auth/dto/edit.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
    async getUser(user: User): Promise<object> {
        return user;
    }
    async editUser(user: User, body: EditObject): Promise<object> {
        const updateUser = await this.prisma.user.update({
            where: { id: user.id },
            data: { ...body },
        });
        delete updateUser.hash;
        return updateUser;
    }
}
