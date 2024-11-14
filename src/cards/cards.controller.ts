import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('cards')
@ApiBearerAuth()
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async create(@Request() req, @Body() createCardDto: CreateCardDto) {
    console.log("vulnerable")
    const user = req.user;
    const hasManyCards = await this.cardsService.legacyCheckIfTenantHasCard(user.id, createCardDto.tenant_id, createCardDto.created_by.first_name);

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
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    const user = req.user;
    
    //return this.cardsService.update(user.id, id, updateCardDto);
    return this.cardsService.legacyUpdate(user.id, id, updateCardDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const user = req.user;

    return this.cardsService.remove(user.id, id);
  }
}
