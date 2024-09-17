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
import * as fs from 'fs';
import { AuthService } from 'src/auth/auth.service';

@Controller('documents')
export class DocumentsController {
  constructor(private authService: AuthService) {}
  @Get('preview')
  async create(@Query('url') url: string) {
    try {
      const response = await fetch(url);
      const responseBody = await response.text();
      return { response: responseBody };
    } catch (error) {
      return { error: 'Failed to fetch the document', details: error.message };
    }
  }

  @Get(':path')
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
