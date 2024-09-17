import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cards } from './cards.model';
import { TenantsService } from 'src/tenants/tenants.service';
import { Tenant } from 'src/tenants/tenant.model';

@Module({
  imports: [SequelizeModule.forFeature([Cards])],
  controllers: [CardsController],
  providers: [CardsService]
})
export class CardsModule {}
