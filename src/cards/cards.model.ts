import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'cards' })
export class Cards extends Model {
  @Column
  name: string;

  @Column
  creditcard_number: string;

  @Column
  cvc: number;

  @Column
  expires_at: Date;

  @Column
  purpose: string;

  @Column
  spending_limit: string;

  @Column
  tenant_id: string;

  @Column
  created_by: string;

  @Column
  is_active: boolean;
}