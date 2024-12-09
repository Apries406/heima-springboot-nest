import { Body, Controller, Get, Headers, HttpCode, Post, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginGuard } from 'src/guard/login/login.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(200)
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUser: LoginUserDto) {
    return this.userService.login(loginUser);
  }

  @Get('profile')
  @SetMetadata('require-login', true)
  @HttpCode(200)
  async getUserInfo(@Headers('authorization') token: string) {
    return this.userService.getUserInfo(token);
  }

  @Post('update')
  @SetMetadata('require-login', true)
  async updateUserInfo(@Body() updateUser: UpdateUserDto, @Headers('authorization') token: string) {
  
    return this.userService.updateUserInfo(updateUser, token);
  }

  @Post('update-avatar')
  @SetMetadata('require-login', true)
  async updateUserAvatar(@Body('updateUrl') updatedUrl: string, @Headers('authorization') token: string) {
    return this.userService.updateUserAvatar(updatedUrl, token);
  }

  @Post('update-password')
  @SetMetadata('require-login', true)
  async updateUserPassword(@Body() updatePwdDto:UpdatePasswordDto, @Headers('authorization') token: string){
    return this.userService.updateUserPassword(updatePwdDto, token);
  }
}
