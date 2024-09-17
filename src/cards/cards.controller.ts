import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Get()
  findAll() {
    return this.cardsService.findAll();
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const user = req.user;

    return this.cardsService.findOne(user.id, id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    const user = req.user;
    return this.cardsService.update(user.id, id, updateCardDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const user = req.user;

    return this.cardsService.remove(user.id, id);
  }
}
