import { Controller, Get, Param, Query, Request } from '@nestjs/common';
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

      // Read the file from the file system asynchronously
      const fileContent = await fs.promises.readFile(file, 'utf-8');

      return {
        success: true,
        data: fileContent,
      };
    } catch (error) {
      // Handle errors such as file not found or permission issues
      return {
        success: false,
        message: 'File could not be read',
        error: error.message,
      };
    }
  }
}
