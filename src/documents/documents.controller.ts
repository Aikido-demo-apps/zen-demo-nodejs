import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  RawBodyRequest,
  Req,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentsService } from './documents.service';

@Controller('documents')
@ApiBearerAuth()
export class DocumentsController {
  constructor(private authService: AuthService, private userService: UsersService, private documentService: DocumentsService) {}

  async legacyCheckIfDocumentExists(document_url: string): Promise<boolean> {
    try {
      // Lazy to do schema updates.. so we mimic a SQL injection in a document lookup for now
      const user = await this.userService.legacyFindUserById(document_url)

      return user !== undefined;
    } catch(error) { 
      return undefined;
    }
  }
  
  @Get('preview')
  @ApiOperation({ summary: 'Preview a document by fetching its content from a given URL' })
  @ApiQuery({ name: 'url', required: true, description: 'The URL of the document to preview' })
  async create(@Query('url') url: string) {
    await this.legacyCheckIfDocumentExists(url);
    try {
      const response = await fetch(url);
      const responseBody = await response.text();
      return { response: responseBody };
    } catch (error) {
      return { error: 'Failed to fetch the document', details: error.message };
    }
  }

  @Get('previewSingleDocumentMetadata')
  @ApiOperation({ summary: 'Provide a document ID to preview the metadata of a single document' })
  @ApiQuery({ name: 'document_id', required: true, description: 'The ID of the document to preview' })
  async previewSingleDocument(@Query('document_id') document_id: string) {
    try {
      const response = await this.documentService.findByContent(document_id);
      return response;
    } catch (error) {
      return { error: 'Failed to add metadata of document', details: error.message };
    }
  }

  @Get('previewLegacy')
  @ApiOperation({ summary: 'Preview a document by fetching its content from a given URL. Legacy endpoint.' })
  @ApiQuery({ name: 'url', required: true, description: 'The URL of the document to preview' })
  async (@Query('url') url: string) {
    try {
      // Make the curl request using execSync
      const response = execSync(`curl -s ${url}`).toString();
      return { content: response };
    } catch (error) {
      return { error: 'Failed to execute curl request', details: error.message };
    }
  }

  @Get('/file/:path')
  @ApiOperation({ summary: 'Fetch a file by its path' })
  @ApiParam({ name: 'path', required: true, description: 'The path to the file to fetch' })
  async fetch(@Request() req, @Param('path') filePath: string) {
    const user = req.user;
    const tenantId = await this.authService.getFirstTenant(user.id);

    try {
      const file = `/usr/uploads/tenant/${tenantId}/files/${filePath}`;

      const fileContent = await fs.promises.readFile(file, 'utf-8');

      return {
        success: true,
        data: Buffer.from(fileContent).toString('base64'),
        rawData: fileContent,
      };
    } catch (error) {
      return {
        success: false,
        message: 'File could not be read',
        error: error.message,
      };
    }
  }

  @Post('add')
  @ApiOperation({ summary: 'Add a document by making a curl request' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'The URL to make the curl request to' },
      },
    },
  })
  addDocument(@Body('url') url: string) {
    try {
      // Make the curl request using execSync
      const response = execSync(`curl -s ${url}`).toString();
      return { content: response };
    } catch (error) {
      return { error: 'Failed to execute curl request', details: error.message };
    }
  }

  @Post('addMetadata')
  async addDocumentMetadata(@Body() createDocumentDto: CreateDocumentDto) {
    try {
      // Make the curl request using execSync
      const response = await this.documentService.create(createDocumentDto);
      return response;
    } catch (error) {
      return { error: 'Failed to add metadata of document', details: error.message };
    }
  }

  @Post('findDocumentsMetadata')
  async findDocumentsMetadata(@Body() createDocumentDto: CreateDocumentDto) {
    try {
      // Make the curl request using execSync
      const response = await this.documentService.findByContent(createDocumentDto.content);
      return response;
    } catch (error) {
      return { error: 'Failed to add metadata of document', details: error.message };
    }
  }

  @Post('findDocumentsMetadataLegacy')
  async findDocumentsMetadataLegacy(@Req() req: Request) {
    const jsonBody = req.body;

    console.log(jsonBody);


    try {
      const response = await this.documentService.findByAnything(jsonBody);
      return response;
    } catch (error) {
      return { error: 'Failed to add metadata of document', details: error.message };
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@Request() req, @UploadedFile() file) {
    const user = req.user;
    
    const tenantId = await this.authService.getFirstTenant(user.id);

    try {
      const uploadDir = `/usr/uploads/tenant/${tenantId}/files`;

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = `${uploadDir}/${file.originalname}`;

      fs.writeFileSync(filePath, file.buffer);

      return {
        success: true,
        message: 'File uploaded successfully',
        fileName: file.originalname,
      };
    } catch (error) {
      return {
        success: false,
        message: 'File upload failed',
        error: error.message,
      };
    }
  }
}
