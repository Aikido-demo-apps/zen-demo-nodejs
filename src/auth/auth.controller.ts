import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from 'src/decorators/user';
import { JwtPayload } from './types';
import { Public } from 'src/decorators/public';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  @ApiBearerAuth()
  getUserInfo(@GetUser() user: JwtPayload) {
    return this.authService.getUserInfo(user.id);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.authenticateUser(loginDto.email_address, loginDto.password);
  }

  // Public signup disabled
  // @Public()
  // @Get('signup')
  // signup(@Query('email_address') email_address, @Query('password') password) {
  //   return this.authService.registerUser(email_address, password)
  // }
}
