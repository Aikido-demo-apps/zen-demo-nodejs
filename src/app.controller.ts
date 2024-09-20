import { Controller, Head } from '@nestjs/common';
import { Public } from './decorators/public';

@Controller()  // This will automatically use the global prefix 'api'
export class AppController {
  
  @Head()
  @Public()
  handleHeadRequest() {
    // No body is returned for a HEAD request, it only sends headers.
    return;
  }
}