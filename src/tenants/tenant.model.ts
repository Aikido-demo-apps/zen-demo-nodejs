import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'tenants' })
export class Tenant extends Model {
  @Column
  name: string;

  @Column
  plan: string;

  @Column
  is_active: boolean;

  @Column
  is_trial: boolean;
}

@Table({ tableName: 'tenants_access' })
export class TenantAccess extends Model {
  @Column
  tenant_id: string;

  @Column
  user_id: number;

  @Column
  role: string;
}
