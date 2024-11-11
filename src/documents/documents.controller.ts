import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import * as fs from 'fs';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Controller('documents')
@ApiBearerAuth()
export class DocumentsController {
  constructor(private authService: AuthService, private userService: UsersService) {}

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
