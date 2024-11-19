import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Document, DocumentSchema } from './schemas/document.schema';
import { DocumentsService } from './documents.service';

@Module({
  providers: [DocumentsService],
  imports: [UsersModule, MongooseModule.forFeature([{ name: Document.name, schema: DocumentSchema }])],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
