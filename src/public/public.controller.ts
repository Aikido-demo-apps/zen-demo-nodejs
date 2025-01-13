import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetUser } from 'src/decorators/user';
import { Public } from 'src/decorators/public';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('/public/')
export class PublicController {
  constructor() {}

   @Public()
   @Get()
   welcome() {
     return "hello"
   }
}
