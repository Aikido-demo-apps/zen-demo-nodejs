import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tenant, TenantAccess } from './tenant.model';

@Module({
  imports: [SequelizeModule.forFeature([Tenant, TenantAccess])],
  providers: [TenantsService],
  controllers: [TenantsController],
  exports: [TenantsService],
})
export class TenantsModule {}
