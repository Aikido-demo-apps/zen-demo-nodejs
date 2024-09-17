import { Controller, Get, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from 'src/decorators/user';
import { JwtPayload } from './types';
import { Public } from 'src/decorators/public';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  getUserInfo(@GetUser() user: JwtPayload) {
    return this.authService.getUserInfo(user.id);
  }

  @Public()
  @Get('login')
  login(@Query('email_address') email_address, @Query('password') password) {
    return this.authService.authenticateUser(email_address, password)
  }

  // Public signup disabled
  // @Public()
  // @Get('signup')
  // signup(@Query('email_address') email_address, @Query('password') password) {
  //   return this.authService.registerUser(email_address, password)
  // }
}
