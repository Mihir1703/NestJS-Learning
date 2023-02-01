import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthObject, LoginAuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @HttpCode(HttpStatus.OK)
    @Post('signup')
    signup(@Body() body: AuthObject) {
        return this.authService.signup(body);
    }
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() body: LoginAuthDto) {
        return this.authService.login(body);
    }
}
