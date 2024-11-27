import { Controller } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('api/tenants')
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}
}
