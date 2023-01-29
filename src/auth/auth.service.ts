import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthObject } from './dto';
import { LoginAuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}
    async login(body: LoginAuthDto): Promise<object> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: body.email,
            },
        });
        if (!user) {
            throw new ForbiddenException('Email is not registered');
        }
        const valid = await argon.verify(user.hash, body.password);
        if (!valid) {
            throw new ForbiddenException('Password is incorrect');
        }
        delete user.hash;
        const token = await this.signToken(user.id, user.email);
        return { success: true, token: token.access_token };
    }
    async signup(body: AuthObject): Promise<object> {
        const hash = await argon.hash(body.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    firstName: body.firstName,
                    lastName: body.lastName,
                    email: body.email,
                    hash: hash,
                },
            });
            delete user.hash;
            return { success: true, user: user };
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new ForbiddenException('Email already exists');
                }
            }
        }
    }
    async signToken(
        userId: number,
        email: string,
    ): Promise<{ access_token: string }> {
        const token = await this.jwt.signAsync(
            { userId, email },
            {
                expiresIn: '1d',
                secret: process.env.JWT_SECRET,
            },
        );
        return { access_token: token };
    }
}
