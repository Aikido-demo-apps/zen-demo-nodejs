import { Connection, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Document } from './schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(@InjectModel(Document.name) private documentModel: Model<Document>, @InjectConnection() private connection: Connection) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<any> {
    const collection = this.connection.collection('documents'); 
  
    const document = {
      name: createDocumentDto.name,    // vulnerable to NoSQL injection
      content: createDocumentDto.content,  // vulnerable to NoSQL injection
      tenant_id: createDocumentDto.tenant_id,  // vulnerable to NoSQL injection
    };
  
    console.log('Inserting document:', JSON.stringify(document, null, 2));
  
    const result = await collection.insertOne(document);
  
    return result;  
  }

  async findByAnything(name: any): Promise<any> {
    const collection = this.connection.collection('documents');

    const query = name;

    console.log('Searching with query:', JSON.stringify(query, null, 2));

    const documents = await collection.find(query).toArray();

    return documents;
  }

  async findByContent(content: any): Promise<any> {
    const collection = this.connection.collection('documents');

    const query = { content };

    console.log('Searching with query:', JSON.stringify(query, null, 2));

    const documents = await collection.find(query).toArray();

    return documents;
  }
}