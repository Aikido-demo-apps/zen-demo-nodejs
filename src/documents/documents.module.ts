import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentsController } from './documents.controller';

@Module({
    controllers: [DocumentsController]
})
export class DocumentsModule {}
