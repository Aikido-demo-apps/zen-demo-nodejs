import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cards } from './cards.model';

@Module({
  imports: [SequelizeModule.forFeature([Cards])],
  controllers: [CardsController],
  providers: [CardsService]
})
export class CardsModule {}
