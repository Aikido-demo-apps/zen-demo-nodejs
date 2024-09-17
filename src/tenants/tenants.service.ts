import { Injectable } from '@nestjs/common';
import { Tenant, TenantAccess } from './tenant.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant)
    private tenantModel: typeof Tenant,
    @InjectModel(TenantAccess)
    private tenantAccessModel: typeof TenantAccess,
  ) {}

  async findAllTenantsFromUser(userId: number): Promise<Tenant[]> {
    const tenantAccess = await this.tenantAccessModel.findAll({
      where: {
        user_id: userId,
      },
    });

    const tenantIds = tenantAccess.map((ta) => ta.tenant_id);

    return this.tenantModel.findAll({
      where: {
        id: tenantIds,
      },
    });
  }

  async findOneByUserId(userId: number): Promise<Tenant> {
    const tenantAccess = await this.tenantAccessModel.findOne({
      where: {
        user_id: userId,
      },
    });

    return this.tenantModel.findOne({
      where: {
        id: tenantAccess.tenant_id,
      },
    });
  }

  async findOneById(id: number): Promise<Tenant> {
    return this.tenantModel.findOne({
      where: {
        id: id,
      },
    });
  }

  async create(
    name: string,
    plan: string,
    is_active: boolean,
    is_trial: boolean,
    user_id: number,
  ) {
    const tenant = await this.tenantModel.create({
      name: name,
      plan: plan,
      is_active: is_active,
      is_trial: is_trial,
    });

    await this.tenantAccessModel.create({
      tenant_id: tenant.id,
      user_id: user_id,
      role: 'admin',
    });

    return tenant;
  }
}
