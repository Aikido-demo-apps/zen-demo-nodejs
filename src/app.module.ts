import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { User } from './users/user.model';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { Tenant, TenantAccess } from './tenants/tenant.model';
import { CardsModule } from './cards/cards.module';
import { Cards } from './cards/cards.model';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      uri:
        process.env.NODE_ENV === 'production'
          ? process.env.DATABASE_URL
          : 'postgresql://root:password@127.0.0.1:27016/main_db',
      models: [User, Tenant, TenantAccess, Cards],
    }),
    UsersModule,
    TenantsModule,
    CardsModule,
    DocumentsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
