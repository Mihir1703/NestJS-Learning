import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthObject, LoginAuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('signup')
    signup(@Body() body: AuthObject) {
        return this.authService.signup(body);
    }
    @Post('login')
    login(@Body() body: LoginAuthDto) {
        return this.authService.login(body);
    }
}
