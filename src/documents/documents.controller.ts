import { Controller, Get, Query } from '@nestjs/common';

@Controller('documents')
export class DocumentsController {
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
}
