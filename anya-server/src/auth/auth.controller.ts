import { Body, Controller, Delete, Patch, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import type LoginBody from './dto/login.dto';
import type SignupBody from './dto/signup.dto';
import type ChangePasswordBody from './dto/change-password.dto';
import { JwtAuthGuard } from './jwt.guard';
import { UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {

    constructor(private authService : AuthService) {}

    @Post("login")
    async login(@Body() body : LoginBody) {

        return this.authService.login(body);

    }

    @Post("signup")
    async Signup(@Body() body : SignupBody) {

        return this.authService.signup(body);

    }
    

    @UseGuards(JwtAuthGuard)
    @Patch("change-password")
    async ChangePassword(@Body() body : ChangePasswordBody , @Request() req : any) {

        const user_data = { username: req.user.username , current_password : body.current_password , new_password : body.new_password };

        return this.authService.change_password(user_data);

    }

    @UseGuards(JwtAuthGuard)
    @Delete("delete-account")
    async DeleteAccount(@Request() req : any) {

        return this.authService.delete_account(req.user.username);

    }

}
