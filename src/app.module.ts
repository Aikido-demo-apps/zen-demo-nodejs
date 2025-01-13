import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthorModule } from './authors/author.module';
import { User } from './users/user.model';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { Tenant, TenantAccess } from './tenants/tenant.model';
import { CardsModule } from './cards/cards.module';
import { Cards } from './cards/cards.model';
import { DocumentsModule } from './documents/documents.module';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicController } from "./public/public.controller";
import { UserMockMiddleware } from "./usermock.middleware";

@Module({
  imports: [
    AuthorModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://admin:veryzVulnerableYez13!@sovulnerablemongodb.fly.dev:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1'),
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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      csrfPrevention: false,
      introspection: true,
      autoSchemaFile: true,
    }),
  ],
  controllers: [AppController, AuthController, PublicController],
  providers: [AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMockMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
