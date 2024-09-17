import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  email_address: string;

  @Column
  username: string;

  @Column
  password: string;

  @Column
  display_name: string;

  @Column
  last_login: Date;
}
